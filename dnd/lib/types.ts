import { TextFieldProps } from "@mui/material";

export type EventData = {
  timestamp: number;
  text: string;
};

export type StoryArc = {
  name: string;
  details: string;
  characters: string[];
  events: EventData[];
  npcs: string[];
  image: string;
  maps: string[];
};

export type UserCampaignData = {
  id: string;
  name: string;
};

export type UserDocument = {
  campaigns: UserCampaignData[];
  email: string;
};

export type CampaignTab =
  | "character-generator"
  | "campaign-player"
  | "map-generator"
  | "music-generator"
  | "timeline";

export type CampaignDocument = {
  name: string;
  userId: string;
  characters: Record<string, Character>;
  npcs: Record<string, Character>;
  enemies: Record<string, Character>;
  arcs: Record<string, StoryArc>;
  map: string | null; // image url of the campaign world map, starts out as null
};

export type CampaignDocumentWithArcsArray = Omit<CampaignDocument, "arcs"> & {
  arcs: StoryArc[];
};

export type NextErrorPageProps = {
  reset: () => void;
  error: Error;
};

export type Ability =
  | "Strength"
  | "Dexterity"
  | "Constitution"
  | "Intelligence"
  | "Wisdom"
  | "Charisma";

export const ALL_ABILITIES: Ability[] = [
  "Strength",
  "Dexterity",
  "Constitution",
  "Intelligence",
  "Wisdom",
  "Charisma",
];

export type Skill =
  | "Acrobatics"
  | "Animal Handling"
  | "Arcana"
  | "Athletics"
  | "Deception"
  | "History"
  | "Insight"
  | "Intimidation"
  | "Investigation"
  | "Medicine"
  | "Nature"
  | "Perception"
  | "Performance"
  | "Persuasion"
  | "Religion"
  | "Sleight of Hand"
  | "Stealth"
  | "Survival";

export const ALL_SKILLS: Skill[] = [
  "Acrobatics",
  "Animal Handling",
  "Arcana",
  "Athletics",
  "Deception",
  "History",
  "Insight",
  "Intimidation",
  "Investigation",
  "Medicine",
  "Nature",
  "Perception",
  "Performance",
  "Persuasion",
  "Religion",
  "Sleight of Hand",
  "Stealth",
  "Survival",
];

type SkillValue = {
  value?: number;
  proficient?: boolean;
};

export type Weapon = {
  name?: string; // there are official weapon names
  attack?: number; // this is the strength ability value
  // these values are tied to the name of the weapon
  damage?: string;
  type?: string;
};

export type Character = {
  name?: string;
  class?: string; // there are official classes
  level?: number;
  background?: string; // there are official backgrounds
  race?: string; // there are official races
  alignment?: string; // there are official alignments
  xp?: number;

  /* first column */
  abilities: Record<
    Ability,
    { base?: number; modifier?: number } // we can calculate the modifier
  >;
  inspiration_num?: number;
  proficiency_bonus?: number;
  saving_throws: Record<Ability, SkillValue>;
  skills: Record<Skill, SkillValue>;
  proficiencies_array: string[];

  /* second column */
  ac?: number; // armor class (calculated from equipment)
  initiative?: number;
  speed?: number;
  hp?: number; // hit points
  temp_hp?: number; // usually in our case will be undefined
  hit_dices?: string; // hit dices are tied to the class
  total_hit_dices?: number; // tied to class and level
  successes: boolean[]; // for death saves
  failures: boolean[]; // for death saves
  weapons_array: Weapon[];
  equipment_array: string[]; // some equipment like armor is official and is how AC is calculated
  // currencies
  cp?: number;
  sp?: number;
  ep?: number;
  gp?: number;
  pp?: number;

  /* third column */
  backstory?: string;
  appearance?: string;
  picture: string | null;
  traits_array: string[];

  /* second page */
  spells: string[];
};

export type AudioType =
  | "music"
  | "weather"
  | "ambience"
  | "animals"
  | "miscellaneous";

export type MusicVariant =
  | "climactic"
  | "mysterious"
  | "adventurous"
  | "somber";

export type WeatherVariant = "rainy" | "stormy" | "windy" | "blizzard";

export type AmbienceVariant =
  | "forest"
  | "dungeon"
  | "tavern"
  | "market"
  | "cave"
  | "ship";

export type AnimalsVariant = "horse" | "wolf" | "dragon";

export type MiscVariant =
  | "footsteps"
  | "door-opening"
  | "whispers"
  | "treasure"
  | "spell";

export type AudioVariantsMap = {
  music: MusicVariant;
  weather: WeatherVariant;
  ambience: AmbienceVariant;
  animals: AnimalsVariant;
  miscellaneous: MiscVariant;
};

export type AudioVariant =
  | MusicVariant
  | WeatherVariant
  | AmbienceVariant
  | AnimalsVariant
  | MiscVariant;

export type MusicDocument<T extends AudioType> = {
  type: T;
  variant: AudioVariantsMap[T];
  files: string[];
};

export type AnyMusicDocument = {
  type: AudioType;
  variant: string;
  files: string[];
};

export type AudioSelectedType =
  | { type: "music"; variant: MusicVariant }
  | { type: "weather"; variant: WeatherVariant }
  | { type: "ambience"; variant: AmbienceVariant }
  | { type: "animals"; variant: AnimalsVariant }
  | { type: "miscellaneous"; variant: MiscVariant };

export type Tone = "Friendly" | "Neutral" | "Antagonistic";

export type AIPrompt = {
  prompt: string | null;
  systemPrompt: string | null;
};

export type CharacterType = "character" | "npc" | "enemy";
export type FirebaseCharacterType = "characters" | "npcs" | "enemies";

type BaseCharacterFormData = Omit<
  TextFieldProps,
  "onChange" | "value" | "label" | "multiple" | "options"
> & {
  label: string;
  type?: string;
  options?: string[];
};

export type SingleValueFormData = BaseCharacterFormData & {
  value: string | number;
  onChange: (val: string) => void;
  multiple?: false;
};

export type MultipleValueFormData = BaseCharacterFormData & {
  value: string[];
  onChange: (val: string[]) => void;
  multiple: true;
};

export type CharacterFormData = SingleValueFormData | MultipleValueFormData;

export type AbilityFormData = Omit<SingleValueFormData, "label" | "value"> & {
  label: Ability;
  base?: number;
  modifier?: number;
};

export type PageParams = { campaignId: string };
