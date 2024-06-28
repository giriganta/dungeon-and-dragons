import {
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Query,
} from "firebase/firestore";
import { db } from "./firebase/firebase";
import {
  AudioType,
  CampaignDocument,
  AnyMusicDocument,
  UserCampaignData,
  UserDocument,
} from "./types";
import { defaultStoryArc } from "./utils";

export async function getUserCampaigns(
  userId: string
): Promise<UserCampaignData[]> {
  const userRef = doc(db, `users/${userId}`);
  const snapshot = await getDoc(userRef);
  if (snapshot.exists()) {
    const document = snapshot.data() as UserDocument;
    return document.campaigns;
  }
  throw Error(`${userId} doc not found`);
}

export async function createCampaign(userId: string): Promise<string> {
  /* Create generic campaign name using data */

  // generate the current date in MM/DD/YYYY format
  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
  const campaignName = `Campaign ${currentDate}`;

  /* Create new campaign document */

  const newCampaign: CampaignDocument = {
    name: campaignName,
    userId,
    arcs: {
      "0": defaultStoryArc,
    },
    characters: {},
    npcs: {},
    enemies: {},
    map: null,
  };
  const campaignDocRef = await addDoc(collection(db, "campaigns"), newCampaign);

  /* Add campaign to user document */

  const userDocRef = doc(db, `users/${userId}`);

  // define the new campaign object for the user
  const newUserCampaign: UserCampaignData = {
    name: campaignName,
    id: campaignDocRef.id,
  };

  // add the new campaign object to the user doc's campaigns array
  await updateDoc(userDocRef, {
    campaigns: arrayUnion(newUserCampaign),
  });

  return campaignDocRef.id;
}

export async function getCampaignData(
  campaignId: string
): Promise<CampaignDocument> {
  const campaignDocRef = doc(db, `campaigns/${campaignId}`);
  const snapshot = await getDoc(campaignDocRef);

  if (snapshot.exists()) {
    const document = snapshot.data() as CampaignDocument;
    return document;
  }

  throw Error(`${campaignId} doc not found`);
}

async function getRandomAudioSampleFromQuery(query: Query) {
  // execute query
  const querySnapshot = await getDocs(query);

  // check if we got any results
  if (!querySnapshot.empty) {
    const firstDoc = querySnapshot.docs[0].data() as AnyMusicDocument;

    // randomly pick one of the music files
    const randomIndex = Math.floor(Math.random() * firstDoc.files.length);
    const musicFile = firstDoc.files[randomIndex];
    return musicFile;
  }
  // fallback to this default for now,
  // in the future when these music samples are actually uploaded to cloud storage, instead throw an error
  const random = Math.random();
  return random < 0.33
    ? "https://firebasestorage.googleapis.com/v0/b/dungeons-dragons-f04f6.appspot.com/o/uploads%2FStarWars60.wav?alt=media&token=c766a557-576c-48ef-93fa-efb515a7fa55"
    : random < 0.67
      ? "https://firebasestorage.googleapis.com/v0/b/dungeons-dragons-f04f6.appspot.com/o/uploads%2FCantinaBand60.wav?alt=media&token=85c75221-b706-4257-bdc4-94957c8d4227"
      : "https://firebasestorage.googleapis.com/v0/b/dungeons-dragons-f04f6.appspot.com/o/uploads%2FPinkPanther30.wav?alt=media&token=817a088c-f156-4737-a1e8-a91ac9822f51";
}

export async function getAudio(
  audioType: AudioType,
  variant: string
): Promise<string> {
  const q = query(
    collection(db, "music"),
    where("type", "==", audioType),
    where("variant", "==", variant)
  );

  const musicLink = await getRandomAudioSampleFromQuery(q);
  return musicLink;
}
