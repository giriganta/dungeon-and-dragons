import theme from "@/lib/theme";
import {
  ALL_ABILITIES,
  ALL_SKILLS,
  Ability,
  Character,
  Skill,
} from "@/lib/types";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  FormControlLabel,
  Typography,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React, { useState } from "react";
import InputField from "./InputField";
import PROFICIENCIES from "@/lib/OtherProficienciesAndLanguages";
import Detail from "./Detail";

type Props = {
  character: Character;
  setCharacter: (c: Character) => void;
  isEditing: boolean;
};

type CharacterFormCheckBox = {
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const ATTR_TO_SKILLS_UPDATE_MAPPING: Record<Ability, Skill[]> = {
  Strength: ["Athletics"],
  Dexterity: ["Acrobatics", "Sleight of Hand", "Stealth"],
  Constitution: [],
  Intelligence: ["Arcana", "History", "Investigation", "Nature", "Religion"],
  Wisdom: ["Animal Handling", "Insight", "Medicine", "Perception", "Survival"],
  Charisma: ["Deception", "Intimidation", "Performance", "Persuasion"],
};

const SKILL_TO_ATTR_MAPPING: Record<Skill, Ability> = {
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

const StatsAndProficienciesForm = ({
  character,
  setCharacter,
  isEditing,
}: Props) => {
  const [eventsSavingAccordionExpanded, setEventsSavingAccordionExpanded] =
    useState(false);
  const [eventsSkillAccordionExpanded, setEventsSkillAccordionExpanded] =
    useState(false);
  const placeholder = isEditing ? "" : "N/A";

  function onAbilityChange(val: string, ability: Ability) {
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

  const formProficienciesFields: CharacterFormCheckBox[] = ALL_ABILITIES.map(
    (ability) => {
      return {
        label: ability,
        checked: character.saving_throws[ability].proficient || false,
        onChange: (e) => {
          character.saving_throws[ability] = {
            proficient: e.target.checked,
            value:
              (character.abilities[ability].modifier || 0) +
              (e.target.checked ? character.proficiency_bonus || 0 : 0),
          };
          setCharacter({ ...character });
        },
      };
    }
  );

  const formSkillsFields: CharacterFormCheckBox[] = ALL_SKILLS.map((skill) => {
    return {
      label: skill,
      checked: character.skills[skill].proficient || false,
      onChange: (e) => {
        const ability = SKILL_TO_ATTR_MAPPING[skill];
        character.skills[skill] = {
          proficient: e.target.checked,
          value:
            (character.abilities[ability].modifier || 0) +
            (e.target.checked ? character.proficiency_bonus || 0 : 0),
        };
        setCharacter({ ...character });
      },
    };
  });

  return (
    <Stack
      direction="column"
      spacing={2}
      bgcolor={theme.palette.info.dark}
      padding={4}
      borderRadius={4}
    >
      <Stack direction="row" spacing={2}>
        <Stack direction="column" spacing={2}>
          {isEditing ? (
            <InputField
              type="number"
              fullWidth
              value={character.inspiration_num || placeholder}
              onChange={(val) =>
                setCharacter({
                  ...character,
                  inspiration_num: Number(val),
                })
              }
              label="Inspiration"
            />
          ) : (
            <Detail
              value={character.inspiration_num || placeholder}
              label="Inspiration"
            />
          )}
          {isEditing ? (
            <InputField
              fullWidth
              value={character.proficiency_bonus || placeholder}
              onChange={(val) => {
                character.proficiency_bonus = Number(val);
                ALL_ABILITIES.forEach((ability) => {
                  const abilityBaseVal = character.abilities[ability].base;
                  if (abilityBaseVal !== undefined) {
                    onAbilityChange(String(abilityBaseVal), ability);
                  }
                });
                setCharacter({ ...character });
              }}
              label="Proficiency Bonus"
            />
          ) : (
            <Detail
              label="Proficiency Bonus"
              value={character.proficiency_bonus || 0}
            />
          )}
          <Accordion
            expanded={eventsSavingAccordionExpanded}
            onChange={() =>
              setEventsSavingAccordionExpanded(!eventsSavingAccordionExpanded)
            }
            sx={{
              borderRadius: 1,
              backgroundColor: theme.palette.info.dark,
            }}
          >
            <AccordionSummary
              sx={{
                mb: eventsSavingAccordionExpanded ? -2 : 0,
                color: theme.palette.primary.contrastText,
              }}
              expandIcon={
                <ExpandMoreIcon
                  sx={{ color: theme.palette.primary.contrastText }}
                />
              }
            >
              <Typography fontSize={18}>{`Saving Throws`}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack>
                {formProficienciesFields.map((field, index) => (
                  <Stack
                    key={field.label}
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <FormControlLabel
                      sx={{ flexGrow: 1 }}
                      label={
                        <Typography
                          style={{
                            color: theme.palette.primary.contrastText,
                          }}
                        >
                          {field.label}
                        </Typography>
                      }
                      labelPlacement="start"
                      control={
                        <Checkbox
                          {...field}
                          style={{ color: theme.palette.primary.contrastText }}
                          disabled={!isEditing}
                        />
                      }
                    />
                    <Box
                      sx={{
                        width: 10,
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Typography
                        style={{
                          color: theme.palette.primary.contrastText,
                        }}
                      >
                        {character.saving_throws[ALL_ABILITIES[index]].value ||
                          0}
                      </Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={eventsSkillAccordionExpanded}
            onChange={() =>
              setEventsSkillAccordionExpanded(!eventsSkillAccordionExpanded)
            }
            sx={{ borderRadius: 1, backgroundColor: theme.palette.info.dark }}
          >
            <AccordionSummary
              sx={{
                mb: eventsSkillAccordionExpanded ? -2 : 0,
                color: theme.palette.primary.contrastText,
              }}
              expandIcon={
                <ExpandMoreIcon
                  sx={{ color: theme.palette.primary.contrastText }}
                />
              }
            >
              <Typography fontSize={18}>{`Skills`}</Typography>
            </AccordionSummary>
            <AccordionDetails
              sx={{ color: theme.palette.primary.contrastText }}
            >
              <Stack>
                {formSkillsFields.map((field, index) => (
                  <Stack
                    key={field.label}
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <FormControlLabel
                      label={
                        <Typography
                          style={{
                            color: theme.palette.primary.contrastText,
                          }}
                        >
                          {field.label}
                        </Typography>
                      }
                      labelPlacement="start"
                      control={
                        <Checkbox
                          {...field}
                          style={{ color: theme.palette.primary.contrastText }}
                          disabled={!isEditing}
                        />
                      }
                      sx={{
                        flexGrow: 1,
                      }}
                    />
                    <Box
                      sx={{
                        width: 10,
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Typography
                        style={{
                          color: theme.palette.primary.contrastText,
                        }}
                      >
                        {character.skills[ALL_SKILLS[index]].value || 0}
                      </Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </AccordionDetails>
          </Accordion>
        </Stack>
      </Stack>
      <Detail
        label="Passive Wisdom"
        value={
          character.skills.Perception.value
            ? character.skills.Perception.value + 10
            : 0
        }
      />
      {isEditing ? (
        <InputField
          label="Other Proficiencies and Languages"
          value={character.proficiencies_array}
          multiple={true}
          onChange={(prof) =>
            setCharacter({ ...character, proficiencies_array: prof })
          }
          options={PROFICIENCIES}
        />
      ) : (
        <Detail
          label="Other Proficiencies and Languages"
          value={character.proficiencies_array}
        />
      )}
    </Stack>
  );
};

export default StatsAndProficienciesForm;
