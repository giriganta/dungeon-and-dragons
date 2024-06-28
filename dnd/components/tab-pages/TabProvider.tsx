import { AudioType, CampaignTab, CharacterType } from "@/lib/types";
import { Options, parseAsStringLiteral, useQueryState } from "nuqs";
import { createContext, useContext } from "react";
import { AudioContext } from "../music/AudioProvider";
import { useSnackbar } from "notistack";
import LinkSnackbar from "../snackbars/LinkSnackbar";

type Props = {
  children: React.ReactNode;
};

type TabContextType = {
  tab: CampaignTab | null;
  setTab: (newTab: CampaignTab | null, options?: Options) => void;

  characterQuery: string | null;
  setCharacterQuery: (s: string | null, options?: Options) => void;

  npcQuery: string | null;
  setNpcQuery: (s: string | null, options?: Options) => void;

  enemyQuery: string | null;
  setEnemyQuery: (s: string | null, options?: Options) => void;

  createCharacterQuery: CharacterType | null;
  setCreateCharacterQuery: (s: CharacterType | null, options?: Options) => void;

  musicTypeQuery: AudioType | null;
  setMusicTypeQuery: (s: AudioType | null, options?: Options) => void;

  campaignTimelineQuery: string | null;
  setCampaignTimelineQuery: (s: string | null, options?: Options) => void;

  goToTab: (newTab: CampaignTab) => void;
  viewCharacter: (characterName: string) => void;
  viewNPC: (npcName: string) => void;
  addCharacter: (type: CharacterType) => void;
  viewArcInTimeline: (campaignName: string) => void;
  toastCharacter: (campaignId: string, characterName: string) => void;
  toastTimeline: (campaignId: string, arcName: string) => void;
  toastMap: (campaignId: string, message: string) => void;
};

const allowableTabs: CampaignTab[] = [
  "character-generator",
  "campaign-player",
  "map-generator",
  "music-generator",
  "timeline",
];

const createCharacterQueryChoices: CharacterType[] = [
  "character",
  "npc",
  "enemy",
];

const audioTypes: AudioType[] = [
  "music",
  "weather",
  "ambience",
  "animals",
  "miscellaneous",
];

// Provide a default value that matches the shape of AudioContextType
const defaultTabContextValue: TabContextType = {
  tab: null,
  setTab: () => {}, // No-op function for default

  characterQuery: null,
  setCharacterQuery: () => {},

  npcQuery: null,
  setNpcQuery: () => {},

  enemyQuery: null,
  setEnemyQuery: () => {},

  createCharacterQuery: null,
  setCreateCharacterQuery: () => {},

  musicTypeQuery: null,
  setMusicTypeQuery: () => {},

  campaignTimelineQuery: null,
  setCampaignTimelineQuery: () => {},

  goToTab: () => {},
  viewCharacter: () => {},
  viewNPC: () => {},
  addCharacter: () => {},
  viewArcInTimeline: () => {},
  toastCharacter: () => {},
  toastTimeline: () => {},
  toastMap: () => {},
};

export const TabContext = createContext(defaultTabContextValue);

const TabProvider = ({ children }: Props) => {
  const { audioSelected } = useContext(AudioContext);
  const [tab, setTab] = useQueryState(
    "tab",
    parseAsStringLiteral(allowableTabs) // pass a readonly list of allowed values
      .withDefault("character-generator")
  );
  const [characterQuery, setCharacterQuery] = useQueryState("character");
  const [npcQuery, setNpcQuery] = useQueryState("npc");
  const [enemyQuery, setEnemyQuery] = useQueryState("enemy");
  const [createCharacterQuery, setCreateCharacterQuery] = useQueryState(
    "create-character",
    parseAsStringLiteral(createCharacterQueryChoices)
  );
  const [musicTypeQuery, setMusicTypeQuery] = useQueryState(
    "music-type",
    parseAsStringLiteral(audioTypes)
  );
  const [campaignTimelineQuery, setCampaignTimelineQuery] =
    useQueryState("arc");

  const { enqueueSnackbar } = useSnackbar();

  function goToTab(newTab: CampaignTab) {
    setTab(newTab, { history: "push" });
    setCharacterQuery(null);
    setNpcQuery(null);
    setEnemyQuery(null);
    setCreateCharacterQuery(null);
    setMusicTypeQuery(audioSelected?.type || null);
    setCampaignTimelineQuery(null);
  }

  function viewCharacter(characterName: string) {
    setTab("character-generator", { history: "push" });
    setCharacterQuery(characterName);
  }

  function viewNPC(npcName: string) {
    setTab("character-generator", { history: "push" });
    setNpcQuery(npcName);
  }

  function addCharacter(type: CharacterType) {
    setTab("character-generator", { history: "push" });
    setCreateCharacterQuery(type);
  }

  function viewArcInTimeline(arcName: string) {
    setTab("timeline", { history: "push" });
    setCampaignTimelineQuery(arcName);
  }

  function toastCharacter(campaignId: string, characterName: string) {
    enqueueSnackbar(
      <LinkSnackbar
        link={`/campaigns/${campaignId}?tab=character-generator&character=${characterName}`}
        message={`${characterName}'s Picture Finished Generating`}
      />,
      { variant: "custom" }
    );
  }

  function toastTimeline(campaignId: string, arcName: string) {
    enqueueSnackbar(
      <LinkSnackbar
        link={`/campaigns/${campaignId}?tab=timeline&arc=${arcName}`}
        message="Arc Details Finished Generating"
      />,
      { variant: "custom" }
    );
  }

  function toastMap(campaignId: string, message: string) {
    enqueueSnackbar(
      <LinkSnackbar
        link={`/campaigns/${campaignId}?tab=map-generator`}
        message={message}
      />,
      { variant: "custom" }
    );
  }

  const value = {
    tab,
    setTab,

    characterQuery,
    setCharacterQuery,

    npcQuery,
    setNpcQuery,

    enemyQuery,
    setEnemyQuery,

    createCharacterQuery,
    setCreateCharacterQuery,

    musicTypeQuery,
    setMusicTypeQuery,

    campaignTimelineQuery,
    setCampaignTimelineQuery,

    // helper functions
    goToTab,
    viewCharacter,
    viewNPC,
    addCharacter,
    viewArcInTimeline,
    toastCharacter,
    toastTimeline,
    toastMap,
  };

  return <TabContext.Provider value={value}>{children}</TabContext.Provider>;
};

export default TabProvider;
