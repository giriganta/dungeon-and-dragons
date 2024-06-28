import { secondaryButtonStyles } from "./theme";
import {
  AIPrompt,
  ALL_ABILITIES,
  Ability,
  Skill,
  Character,
  CharacterType,
  FirebaseCharacterType,
  Weapon,
} from "./types";

export function characterForPrompt(character: Character): string {
  const characterCopy: Partial<Character> = { ...character };
  delete characterCopy["picture"];

  return JSON.stringify(characterCopy);
}

export const characterTypeMapping: Record<CharacterType, string> = {
  character: "Character",
  npc: "NPC",
  enemy: "Enemy",
};

export function characterSheetFilename(characterName: string) {
  return `${characterName.split(" ")[0] || "new"}_character_sheet.pdf`;
}

export const DEFAULT_ARC_NAME = "AI Generating Name...";
export const defaultStoryArc = {
  name: DEFAULT_ARC_NAME,
  details: "",
  image: "",
  events: [],
  characters: [],
  npcs: [],
  maps: [],
};

export const apiPrefix =
  process.env.NODE_ENV == "development"
    ? "http://localhost:5000"
    : (process.env.NEXT_PUBLIC_BACKEND_URL as string);

export const center = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

export const ATTR_TO_SKILLS_UPDATE_MAPPING: Record<Ability, Skill[]> = {
  Strength: ["Athletics"],
  Dexterity: ["Acrobatics", "Sleight of Hand", "Stealth"],
  Constitution: [],
  Intelligence: ["Arcana", "History", "Investigation", "Nature", "Religion"],
  Wisdom: ["Animal Handling", "Insight", "Medicine", "Perception", "Survival"],
  Charisma: ["Deception", "Intimidation", "Performance", "Persuasion"],
};

export const SKILL_TO_ATTR_MAPPING: Record<Skill, Ability> = {
  Athletics: "Strength",
  Acrobatics: "Dexterity",
  "Sleight of Hand": "Dexterity",
  Stealth: "Dexterity",
  Arcana: "Intelligence",
  History: "Intelligence",
  Investigation: "Intelligence",
  Nature: "Intelligence",
  Religion: "Intelligence",
  "Animal Handling": "Wisdom",
  Insight: "Wisdom",
  Medicine: "Wisdom",
  Perception: "Wisdom",
  Survival: "Wisdom",
  Deception: "Charisma",
  Intimidation: "Charisma",
  Performance: "Charisma",
  Persuasion: "Charisma",
};

export function onAbilityChange(
  character: Character,
  val: string,
  ability: Ability
) {
  // update ability
  character.abilities[ability] = {
    base: Number(val),
    modifier: Math.floor((Number(val) - 10) / 2),
  };
  // update saving throw
  character.saving_throws[ability] = {
    proficient: character.saving_throws[ability].proficient,
    value:
      (Math.floor((Number(val) - 10) / 2) || 0) +
      (character.saving_throws[ability].proficient
        ? character.proficiency_bonus || 0
        : 0),
  };
  // update skills
  ATTR_TO_SKILLS_UPDATE_MAPPING[ability].forEach((skill) => {
    character.skills[skill] = {
      proficient: character.skills[skill].proficient,
      value:
        (Math.floor((Number(val) - 10) / 2) || 0) +
        (character.skills[skill].proficient
          ? character.proficiency_bonus || 0
          : 0),
    };
  });
}

// these are fields of the character that we want gpt to generate. TODO: include more complex types like weapons, ability stats, etc
const generatableKeys = [
  "name",
  "class",
  "level",
  "background",
  "race",
  "alignment",
  "xp",
  "proficiency_bonus",
  "ac",
  "speed",
  "hp",
  "appearance",
  "backstory",
];

const contextualKeys = new Set([
  "name",
  "class",
  "background",
  "race",
  "alignment",
]);

function getGeneratableFields(character: Character) {
  const nullFields: Record<string, unknown> = {};
  const presentFields: Record<string, unknown> = {};

  function populateObjects(key: string, value: unknown) {
    if (value === undefined || value === "" || value === 0) {
      nullFields[key] = null;
    } else {
      presentFields[key] = value;
    }
  }

  function populateObjectsWithArray(key: string, array: unknown[]) {
    if (array.length > 0) {
      presentFields[key] = array;
    } else {
      nullFields[key] = null;
    }
  }

  // add simple keys
  generatableKeys.forEach((key) => {
    const value = character[key as keyof Character];
    populateObjects(key, value);
  });
  // add ability base values
  ALL_ABILITIES.forEach((key) => {
    const value = character.abilities[key].base;
    populateObjects(key, value);
  });
  // add arrays
  populateObjectsWithArray("equipment_array", character.equipment_array);
  const weaponNames = character.weapons_array.map((weapon) => weapon.name);
  populateObjectsWithArray("weapons_array", weaponNames);
  populateObjectsWithArray(
    "proficiencies_array",
    character.proficiencies_array
  );

  // clean the present fields of non-context applicable keys (stuff that is "garbage" to gpt, unnecessary)
  Object.keys(presentFields).forEach((key) => {
    if (!contextualKeys.has(key)) {
      delete presentFields[key];
    }
  });

  return { nullFields, presentFields };
}

export function getCharacterPrompt(
  characterInfo: Character,
  userPrompt?: string
) {
  const { nullFields, presentFields } = getGeneratableFields(characterInfo);
  const nullFieldsEmpty = Object.keys(nullFields).length == 0;
  const presentFieldsEmpty = Object.keys(presentFields).length == 0;
  if (nullFieldsEmpty) {
    return null; // nothing new to generate, everything is filled out
  }

  const infoPrompt = presentFieldsEmpty
    ? JSON.stringify(nullFields)
    : `Here are the current fields:
${JSON.stringify(presentFields)}.
And here are the null fields you must fill out:
${JSON.stringify(nullFields)}`;

  /* As we give gpt ability to fill out more arrays, add more here */
  const isFillingOutArray =
    characterInfo.equipment_array.length == 0 ||
    characterInfo.weapons_array.length == 0 ||
    characterInfo.proficiencies_array.length == 0;

  const prompt = `Fill out the null fields for this character with new values. Format your response with JSON-valid objects separated by lines like so:
{"field1": value1}
{"field2": value2}
etc. ${userPrompt || ""} ${characterInfo.backstory ? "" : "Write ~150 words for the backstory."} ${isFillingOutArray ? "For arrays, fill out the array with some string names." : ""}
${infoPrompt}`;
  return prompt;
}

export const DEFAULT_CHAR_AI_PROMPT: AIPrompt = {
  prompt: null,
  systemPrompt:
    "You are an assistant to a DnD dungeon master designed to help create characters.",
};

export function parseGPTCharacterOutput(
  streamedData: string,
  characterInfo: Character,
  setCharacterInfo: (c: Character) => void
) {
  if (streamedData) {
    const newCharacterInfo = { ...characterInfo };
    streamedData.split("\n").forEach((line) => {
      try {
        // sometimes gpt ends each line with a comma even though we tell it not to, so if this is the case,
        // we can still parse it by removing the comma manually
        line = line.endsWith(",") ? line.slice(0, line.length - 1) : line;
        const obj = JSON.parse(line);
        /* now this could either be three scenarios:
        1. we have an array of weapon names which we need to use to create weapon objects for newCharacterInfo.weapons_array
        2. we have an ability, such as Strength or Dexterity which we need to apply to newCharacterInfo.abilities
        3. we can just simply assign the obj's key value pair to newCharacterInfo
        */
        const key = Object.keys(obj)[0];
        if (key == "weapons_array") {
          // case 1
          const weaponNames: string[] = obj[key];
          newCharacterInfo.weapons_array = weaponNames.map((weaponName) => {
            const newWeapon: Weapon = {
              name: weaponName,
            };
            return newWeapon;
          });
        } else if (ALL_ABILITIES.includes(key as Ability)) {
          // case 2
          onAbilityChange(newCharacterInfo, String(obj[key]), key as Ability);
        } else {
          // this is the default case (case 3)
          Object.assign(newCharacterInfo, obj);
        }
      } catch {
        /* often times we will not be able to parse the last line of streamed data since it hasn't finished streaming that 
          line yet. Also, if gpt doesn't follow our instructions and gives us wrong values (such as not a string[] for 
          weapons_array), then our parsing logic could also fail for that line */
      }
    });
    setCharacterInfo(newCharacterInfo);
  }
}

export const characterFormWidth = { md: "90%", xs: "95%" };

export function isDeepEqual(x: unknown, y: unknown): boolean {
  const ok = Object.keys;
  const tx = typeof x;
  const ty = typeof y;
  return x && y && tx === "object" && tx === ty
    ? ok(x).length === ok(y).length &&
        ok(x).every((key) =>
          isDeepEqual(
            (x as Record<string, unknown>)[key],
            (y as Record<string, unknown>)[key]
          )
        )
    : x === y;
}

export const firebaseCharacterTypeMapping: Record<
  CharacterType,
  FirebaseCharacterType
> = {
  character: "characters",
  npc: "npcs",
  enemy: "enemies",
};

export const boxShadow = "4px 4px 5px black";

export const ABILITY_COLOR_MAPPING: Record<Ability, string> = {
  Strength: "rgba(150, 10, 10, 0.5)",
  Dexterity: "rgba(255, 145, 0, 0.5)",
  Constitution: secondaryButtonStyles.bgcolor,
  Intelligence: "rgba(21, 65, 136, 0.6)",
  Wisdom: "rgba(26, 71, 30, 0.5)",
  Charisma: "rgba(71, 25, 100, 0.4)",
};
