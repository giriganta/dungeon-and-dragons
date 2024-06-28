import {
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  arrayRemove,
  deleteField,
} from "firebase/firestore";
import { db, storage } from "./firebase/firebase";
import {
  CampaignDocument,
  Character,
  UserCampaignData,
  UserDocument,
  StoryArc,
  EventData,
  FirebaseCharacterType,
} from "./types";
import { mutate } from "swr";
import axios from "axios";
import { DEFAULT_ARC_NAME, defaultStoryArc } from "./utils";
import { deleteObject, ref } from "firebase/storage";

/* 
 This file contains firebase sdk code that uses the mutate() function from swr 
 (i.e. we update something on firebase and call mutate to tell swr to refetch)
*/

export async function addNewCharacter(
  campaignId: string,
  characterData: Character,
  type: FirebaseCharacterType
) {
  const campaignDocRef = doc(db, `campaigns/${campaignId}`);

  await updateDoc(campaignDocRef, {
    [`${type}.${characterData.name}`]: characterData,
  });
  mutate(`/api/campaigns/${campaignId}`);
}

export async function rewindCampaign(campaignId: string, arcs: StoryArc[]) {
  const campaignDocRef = doc(db, `campaigns/${campaignId}`);

  // reset the last arc's info since we are now continuing from that arc (it is no longer completed)
  const lastArc = arcs[arcs.length - 1];
  lastArc.name = DEFAULT_ARC_NAME;
  lastArc.image = "";
  lastArc.details = "";

  const newArcs = Object.assign({}, arcs) as unknown as Record<
    string,
    StoryArc
  >;
  const update: Partial<CampaignDocument> = {
    arcs: newArcs,
  };
  await updateDoc(campaignDocRef, update);

  // revalidate path at end
  mutate(`/api/campaigns/${campaignId}`);
}

export async function updateCampaignName(
  userId: string,
  campaignId: string,
  newName: string
) {
  // update campaign doc
  const campaignDocRef = doc(db, `campaigns/${campaignId}`);
  await updateDoc(campaignDocRef, {
    name: newName,
  });

  // also to remember to update the campaign name within the user doc
  const userDocRef = doc(db, `users/${userId}`);
  const snapshot = await getDoc(userDocRef);

  if (snapshot.exists()) {
    const userDocumentData = snapshot.data() as UserDocument;
    const newUserCampaigns: UserCampaignData[] = userDocumentData.campaigns.map(
      (userCampaignData) => {
        if (userCampaignData.id == campaignId) {
          return { id: campaignId, name: newName };
        } else {
          return userCampaignData;
        }
      }
    );

    const updatedDoc: Partial<UserDocument> = {
      campaigns: newUserCampaigns,
    };
    await updateDoc(userDocRef, updatedDoc);
  }

  // revalidate path at end
  mutate(`/api/campaigns/${campaignId}`);
}

export async function generatePictureForCharacter(
  campaignId: string,
  characterData: Character,
  type: FirebaseCharacterType,
  toastCharacter: () => void,
  oldCharacterPicture?: string
) {
  if (oldCharacterPicture) {
    await deleteFirebaseImage(oldCharacterPicture);
  }
  await axios.post("/api/generate_character_image", {
    campaignId,
    characterData,
    type,
  });

  // revalidate path at end
  mutate(`/api/campaigns/${campaignId}`);
  // create a toast saying this character's picture is done generating
  toastCharacter();
}

export async function deleteCampaign(campaignId: string, userId: string) {
  const campaignDocRef = doc(db, `campaigns/${campaignId}`);
  await deleteDoc(campaignDocRef);

  // also to remember to update the campaign name within the user doc
  const userDocRef = doc(db, `users/${userId}`);
  const snapshot = await getDoc(userDocRef);

  if (snapshot.exists()) {
    const userDocumentData = snapshot.data() as UserDocument;
    const newUserCampaigns: UserCampaignData[] =
      userDocumentData.campaigns.filter(
        (userCampaignData) => userCampaignData.id != campaignId
      );

    const updatedDoc: Partial<UserDocument> = {
      campaigns: newUserCampaigns,
    };
    await updateDoc(userDocRef, updatedDoc);
  }

  mutate(`/api/user_campaigns/${userId}`);
}

export async function addEvent(
  campaignId: string,
  arcIndex: number,
  newEvent: EventData
) {
  const campaignDocRef = doc(db, `campaigns/${campaignId}`);

  await updateDoc(campaignDocRef, {
    [`arcs.${arcIndex}.events`]: arrayUnion(newEvent),
  });

  mutate(`/api/campaigns/${campaignId}`);
}

export async function removeEvent(
  campaignId: string,
  arcIndex: number,
  eventToRemove: EventData
) {
  const campaignDocRef = doc(db, `campaigns/${campaignId}`);

  await updateDoc(campaignDocRef, {
    [`arcs.${arcIndex}.events`]: arrayRemove(eventToRemove),
  });

  mutate(`/api/campaigns/${campaignId}`);
}

export async function saveArc(campaignId: string, arcIndex: number) {
  const campaignDocRef = doc(db, `campaigns/${campaignId}`);
  const newStoryArc: StoryArc = defaultStoryArc;

  await updateDoc(campaignDocRef, {
    [`arcs.${arcIndex + 1}`]: newStoryArc,
  });

  mutate(`/api/campaigns/${campaignId}`);
}

export async function generateArcInfo(
  campaignId: string,
  arcIndex: number,
  previousArcSummary: string,
  events: string[],
  toastCallback: (arcName: string) => void
) {
  function getEventsForPrompt() {
    /**
     * This function just gets up to 9 events from the events list:
     * the first two, the middle two, and the last 5. This is so we can
     * include as many events as possible while minimizing prompt size (and cost!)
     */
    if (events.length <= 7) {
      return events;
    } else {
      const eventsToIncludeInPrompt = [];
      // Always include the first two events
      eventsToIncludeInPrompt.push(events[0], events[1]);

      // Calculate middle indices, ensuring they are distinct from the first and last five elements
      const midPoint = Math.floor(events.length / 2);
      const middleIndices = [midPoint - 1, midPoint].filter(
        (index) => index > 1 && index < events.length - 5
      );

      // Include the middle two events based on calculated indices
      middleIndices.forEach((index) => {
        eventsToIncludeInPrompt.push(events[index]);
      });

      // Include the last five events
      eventsToIncludeInPrompt.push(...events.slice(-5));
      return eventsToIncludeInPrompt;
    }
  }
  const eventsToIncludeInPrompt = getEventsForPrompt();

  const promptPrevArcSummary = previousArcSummary
    ? `

For context, this is the summary of the previous arc in the story:
${previousArcSummary}`
    : "";

  const prompt = `Create a title and summary (~175 words) for the following events from this DnD campaign:
${JSON.stringify(eventsToIncludeInPrompt)}.${promptPrevArcSummary}

Please format your response like so (with no asterisks):
Title: title

Summary: summary`;

  const res = await axios.post("/api/generate_arc_summary", {
    campaignId,
    arcIndex,
    prompt,
  });
  const arcName: string = res.data;

  // revalidate path at end
  mutate(`/api/campaigns/${campaignId}`);
  // create the toast to notify user that content finished generating
  toastCallback(arcName);
}

export async function replaceCharacter(
  campaignId: string,
  oldCharacterName: string,
  newCharacter: Character,
  firebaseCharacterType: FirebaseCharacterType
) {
  const campaignDocRef = doc(db, `campaigns/${campaignId}`);

  await updateDoc(campaignDocRef, {
    [`${firebaseCharacterType}.${oldCharacterName}`]: deleteField(),
    [`${firebaseCharacterType}.${newCharacter.name}`]: newCharacter,
  });

  mutate(`/api/campaigns/${campaignId}`);
}

export async function deleteCharacter(
  campaignId: string,
  characterName: string
) {
  const campaignDocRef = doc(db, `campaigns/${campaignId}`);

  await updateDoc(campaignDocRef, {
    [`characters.${characterName}`]: deleteField(),
  });

  mutate(`/api/campaigns/${campaignId}`);
}

export async function generateMapImage(
  campaignId: string,
  prompt: string,
  toastMap: () => void,
  arcIndex: number = -1,
  mapImagesInArc?: string[]
) {
  await axios.post("/api/generate_map_image", {
    campaignId,
    prompt,
    arcIndex,
    mapImagesInArc,
  });

  // revalidate path at end
  mutate(`/api/campaigns/${campaignId}`);
  // create a toast saying this campaign's world map is done generating
  toastMap();
}

async function deleteFirebaseImage(imageUrl: string) {
  const startOfPathInUrl = imageUrl.indexOf("images/");
  const firebaseStoragePath = imageUrl.slice(startOfPathInUrl);
  const fileRef = ref(storage, firebaseStoragePath);
  await deleteObject(fileRef);
}

export async function createLoadingWorldMap(
  campaignId: string,
  oldWorldMapImageUrl: string | null
) {
  if (oldWorldMapImageUrl) {
    await deleteFirebaseImage(oldWorldMapImageUrl);
  }
  const campaignDocRef = doc(db, `campaigns/${campaignId}`);

  await updateDoc(campaignDocRef, {
    map: "",
  });

  mutate(`/api/campaigns/${campaignId}`);
}

export async function createLoadingArcMap(
  campaignId: string,
  arcIndex: number
) {
  const campaignDocRef = doc(db, `campaigns/${campaignId}`);

  await updateDoc(campaignDocRef, {
    [`arcs.${arcIndex}.maps`]: arrayUnion(""),
  });

  mutate(`/api/campaigns/${campaignId}`);
}

export async function setArcMaps(
  campaignId: string,
  arcIndex: number,
  newArcMaps: string[],
  mapThatWeAreEditing: string
) {
  await deleteFirebaseImage(mapThatWeAreEditing);

  const campaignDocRef = doc(db, `campaigns/${campaignId}`);

  await updateDoc(campaignDocRef, {
    [`arcs.${arcIndex}.maps`]: newArcMaps,
  });

  mutate(`/api/campaigns/${campaignId}`);
}
