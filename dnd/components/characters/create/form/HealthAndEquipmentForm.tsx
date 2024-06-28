import theme from "@/lib/theme";
import { Character } from "@/lib/types";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InputField from "./InputField";
import { equipment } from "@/lib/Equipment";
import Detail from "./Detail";
import WeaponsSection from "./WeaponsSection";
import { Divider, Radio } from "@mui/material";

type Props = {
  character: Character;
  setCharacter: (c: Character) => void;
  isEditing: boolean;
};

const HealthAndEquipmentForm = ({
  character,
  setCharacter,
  isEditing,
}: Props) => {
  const [eventsDeathSavingAccordionExpanded, setEventsSavingAccordionExpanded] =
    useState(false);

  const [eventsMoneyAccordionExpanded, setEventsMoneyAccordionExpanded] =
    useState(false);

  const placeholder = isEditing ? "" : "N/A";

  return (
    <Stack
      spacing={2}
      bgcolor={theme.palette.info.dark}
      padding={4}
      borderRadius={4}
    >
      {isEditing ? (
        <Stack direction="row" spacing={2}>
          <InputField
            type="number"
            value={character.ac || placeholder}
            onChange={(val) => setCharacter({ ...character, ac: Number(val) })}
            label="Armor Class"
          />
          <InputField
            type="number"
            value={character.initiative || placeholder}
            onChange={(val) =>
              setCharacter({ ...character, initiative: Number(val) })
            }
            label="Initiative"
          />
          <InputField
            type="number"
            value={character.speed || placeholder}
            onChange={(val) =>
              setCharacter({ ...character, speed: Number(val) })
            }
            label="Speed"
          />
        </Stack>
      ) : (
        <Stack
          direction="row"
          spacing={2}
          bgcolor={theme.palette.info.dark}
          padding={4}
          borderRadius={4}
        >
          <Detail label="Armor Class" value={character.ac || placeholder} />
          <Detail
            label="Initiative"
            value={character.initiative || placeholder}
          />
          <Detail label="Speed" value={character.speed || placeholder} />
        </Stack>
      )}
      {isEditing ? (
        <InputField
          type="number"
          value={character.hp || placeholder}
          onChange={(val) => setCharacter({ ...character, hp: Number(val) })}
          label="Hit Points"
        />
      ) : (
        <Detail label="Hit Points" value={character.hp || placeholder} />
      )}
      {isEditing ? (
        <InputField
          type="number"
          value={character.temp_hp || placeholder}
          onChange={(val) =>
            setCharacter({ ...character, temp_hp: Number(val) })
          }
          label="Temporary Hit Points"
        />
      ) : (
        <Detail
          label="Temporary Hit Points"
          value={character.temp_hp || placeholder}
        />
      )}
      <Stack direction="row" spacing={2}>
        <Stack>
          {isEditing ? (
            <InputField
              value={character.hit_dices || placeholder}
              onChange={(val) => setCharacter({ ...character, hit_dices: val })}
              label="Hit Dice"
            />
          ) : (
            <Detail
              label="Hit Dice"
              value={character.hit_dices || placeholder}
            />
          )}
        </Stack>
        <Stack>
          <Accordion
            expanded={eventsDeathSavingAccordionExpanded}
            onChange={() =>
              setEventsSavingAccordionExpanded(
                !eventsDeathSavingAccordionExpanded
              )
            }
            sx={{
              borderRadius: 1,
              backgroundColor: theme.palette.info.dark,
            }}
          >
            <AccordionSummary
              sx={{
                mb: eventsDeathSavingAccordionExpanded ? -2 : 0,
                color: theme.palette.primary.contrastText,
              }}
              expandIcon={
                <ExpandMoreIcon
                  sx={{ color: theme.palette.primary.contrastText }}
                />
              }
            >
              <Typography fontSize={18}>{`Death Saves`}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {isEditing ? (
                <Stack>
                  <Typography fontSize={18}>{`Successes`}</Typography>
                  <Stack direction={"row"}>
                    {character.successes.map((s, index) => (
                      <Radio
                        key={index}
                        checked={character.successes[index]}
                        onChange={(e) => {
                          character.successes[index] = e.target.checked;
                          setCharacter({ ...character });
                        }}
                      ></Radio>
                    ))}
                  </Stack>
                  <Typography fontSize={18}>{`Failures`}</Typography>
                  <Stack direction={"row"}>
                    {character.successes.map((s, index) => (
                      <Radio
                        key={index}
                        checked={character.failures[index]}
                        onChange={(e) => {
                          character.failures[index] = e.target.checked;
                          setCharacter({ ...character });
                        }}
                      ></Radio>
                    ))}
                  </Stack>
                </Stack>
              ) : (
                <Stack>
                  <Stack
                    spacing={1}
                    alignItems={{ sm: "flex-start", xs: "center" }}
                  >
                    <Stack position="relative" width="fit-content">
                      <Typography fontWeight="bold">{"Successes"}</Typography>
                      <Divider
                        flexItem
                        sx={{
                          alignSelf: { sm: "flex-start", xs: "center" },
                          width: "calc(100% + 15px)",
                        }}
                      />
                    </Stack>
                    <Stack direction={"row"}>
                      {character.successes.map((s, index) => (
                        <Radio
                          key={index}
                          checked={character.successes[index]}
                          disabled={true}
                        ></Radio>
                      ))}
                    </Stack>
                  </Stack>
                  <Stack
                    spacing={1}
                    alignItems={{ sm: "flex-start", xs: "center" }}
                  >
                    <Stack position="relative" width="fit-content">
                      <Typography fontWeight="bold">{"Failures"}</Typography>
                      <Divider
                        flexItem
                        sx={{
                          alignSelf: { sm: "flex-start", xs: "center" },
                          width: "calc(100% + 15px)",
                        }}
                      />
                    </Stack>
                    <Stack direction={"row"}>
                      {character.failures.map((s, index) => (
                        <Radio
                          key={index}
                          checked={character.failures[index]}
                          disabled={true}
                        ></Radio>
                      ))}
                    </Stack>
                  </Stack>
                </Stack>
              )}
            </AccordionDetails>
          </Accordion>
        </Stack>
        <Accordion
          expanded={eventsMoneyAccordionExpanded}
          onChange={() =>
            setEventsMoneyAccordionExpanded(!eventsMoneyAccordionExpanded)
          }
          sx={{
            borderRadius: 1,
            backgroundColor: theme.palette.info.dark,
          }}
        >
          <AccordionSummary
            sx={{
              mb: eventsMoneyAccordionExpanded ? -2 : 0,
              color: theme.palette.primary.contrastText,
            }}
            expandIcon={
              <ExpandMoreIcon
                sx={{ color: theme.palette.primary.contrastText }}
              />
            }
          >
            <Typography fontSize={18}>{`Money`}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {isEditing ? (
              <Stack>
                <InputField
                  type="number"
                  value={character.cp || placeholder}
                  onChange={(val) =>
                    setCharacter({
                      ...character,
                      cp: Number(val),
                    })
                  }
                  label="Copper"
                  sx={{ color: theme.palette.primary.contrastText }}
                />
                <InputField
                  type="number"
                  value={character.sp || placeholder}
                  onChange={(val) =>
                    setCharacter({
                      ...character,
                      sp: Number(val),
                    })
                  }
                  label="Silver"
                  sx={{ color: theme.palette.primary.contrastText }}
                />
                <InputField
                  type="number"
                  value={character.ep || placeholder}
                  onChange={(val) =>
                    setCharacter({
                      ...character,
                      ep: Number(val),
                    })
                  }
                  label="Electrum"
                  sx={{ color: theme.palette.primary.contrastText }}
                />
                <InputField
                  type="number"
                  value={character.gp || placeholder}
                  onChange={(val) =>
                    setCharacter({
                      ...character,
                      gp: Number(val),
                    })
                  }
                  label="Gold"
                  sx={{ color: theme.palette.primary.contrastText }}
                />

                <InputField
                  type="number"
                  value={character.pp || placeholder}
                  onChange={(val) =>
                    setCharacter({
                      ...character,
                      pp: Number(val),
                    })
                  }
                  label="Platinum"
                  sx={{ color: theme.palette.primary.contrastText }}
                />
              </Stack>
            ) : (
              <Stack>
                <Detail label="Copper" value={character.cp || placeholder} />
                <Detail label="Silver" value={character.sp || placeholder} />
                <Detail label="Electrum" value={character.ep || placeholder} />
                <Detail label="Gold" value={character.gp || placeholder} />
                <Detail label="Platinum" value={character.pp || placeholder} />
              </Stack>
            )}
          </AccordionDetails>
        </Accordion>
      </Stack>
      <WeaponsSection
        weaponsArray={character.weapons_array}
        setWeapons={(newWeaponsArray) =>
          setCharacter({ ...character, weapons_array: newWeaponsArray })
        }
        isEditing={isEditing}
      />
      {isEditing ? (
        <InputField
          label="Equipment"
          value={character.equipment_array}
          multiple={true}
          onChange={(eq) => setCharacter({ ...character, equipment_array: eq })}
          options={equipment}
        />
      ) : (
        <Detail
          label="Equipment"
          value={character.equipment_array || placeholder}
        />
      )}
    </Stack>
  );
};

export default HealthAndEquipmentForm;
