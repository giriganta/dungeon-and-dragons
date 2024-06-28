import ImageGenerating from "@/components/ImageGenerating";
import { Character, CharacterFormData, CharacterType } from "@/lib/types";
import { Box, Grid, Stack, Typography } from "@mui/material";
import Image from "next/image";
import Detail from "./Detail";
import theme from "@/lib/theme";
import { boxShadow, center, characterTypeMapping } from "@/lib/utils";
import InputField from "./InputField";
import LoadingButton, { LoadingButtonProps } from "@mui/lab/LoadingButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot } from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import { TabContext } from "@/components/tab-pages/TabProvider";

type Props = {
  character: Character;
  setCharacter: (c: Character) => void;
  isEditing: boolean;
  handleGenerate: () => void;
  generateLoading: boolean;
};

const HeaderForm = ({
  character,
  setCharacter,
  isEditing,
  handleGenerate,
  generateLoading,
}: Props) => {
  const { createCharacterQuery, characterQuery, npcQuery, enemyQuery } =
    useContext(TabContext);
  const type: CharacterType =
    createCharacterQuery ||
    (characterQuery && "character") ||
    (npcQuery && "npc") ||
    (enemyQuery && "enemy") ||
    "character"; // fallback

  const loadingButtonSx = {
    py: 2,
    px: 4,
    display: "flex",
    alignItems: "center",
    gap: 1,
  };
  const placeholder = isEditing ? "" : "N/A";
  const fields: CharacterFormData[] = [
    {
      label: "Class",
      value: character.class || placeholder,
      onChange: (val) => setCharacter({ ...character, class: val }),
      options: [
        "Barbarian",
        "Bard",
        "Cleric",
        "Druid",
        "Fighter",
        "Monk",
        "Paladin",
        "Ranger",
        "Rogue",
        "Sorcerer",
        "Warlock",
        "Wizard",
      ],
    },
    {
      label: "Level",
      value: character.level || placeholder,
      onChange: (val) => setCharacter({ ...character, level: Number(val) }),
      type: "number",
    },
    {
      label: "Background",
      value: character.background || placeholder,
      onChange: (val) => setCharacter({ ...character, background: val }),
      options: [
        "Acolyte",
        "Anthropologist",
        "Archaeologist",
        "Athlete",
        "Charlatan",
        "City Watch",
        "Clan Crafter",
        "Cloistered Scholar",
        "Courtier",
        "Criminal",
        "Entertainer",
        "Faceless",
        "Faction Agent",
        "Far Traveler",
        "Feylost",
        "Fisher",
        "Folk Hero",
        "Giant Foundling",
        "Gladiator",
        "Guild Artisan",
        "Guild Merchant",
        "Haunted One",
        "Hermit",
        "House Agent",
        "Inheritor",
        "Investigator",
        "Knight",
        "Knight of the Order",
        "Marine",
        "Mercenary Veteran",
        "Noble",
        "Outlander",
        "Pirate",
        "Rewarded",
        "Ruined",
        "Rune Carver",
        "Sage",
        "Sailor",
        "Shipwright",
        "Smuggler",
        "Soldier",
        "Spy",
        "Urban Bounty Hunter",
        "Urchin",
        "Uthgardt Tribe Member",
        "Waterdhavian Noble",
        "Witchlight Hand",
      ],
    },
    {
      label: "Race",
      value: character.race || placeholder,
      onChange: (val) => setCharacter({ ...character, race: val }),
      options: [
        "Dragonborn",
        "Dwarf",
        "Elf",
        "Gnome",
        "Half-Elf",
        "Half-Orc",
        "Halfling",
        "Human",
        "Tiefling",
      ],
    },
    {
      label: "Alignment",
      value: character.alignment || placeholder,
      onChange: (val) => setCharacter({ ...character, alignment: val }),
      options: [
        "Lawful Good",
        "Neutral Good",
        "Chaotic Good",
        "Lawful Neutral",
        "True Neutral",
        "Chaotic Neutral",
        "Lawful Evil",
        "Neutral Evil",
        "Chaotic Evil",
      ],
    },
    {
      label: "Experience Points",
      value: character.xp || placeholder,
      onChange: (val) => setCharacter({ ...character, xp: Number(val) }),
      type: "number",
    },
  ];

  return (
    <Stack alignItems="center" spacing={2}>
      {isEditing ? (
        <Stack
          width="100%"
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={{ md: 8, xs: 2 }}
        >
          <GenerateButton
            sx={{
              ...loadingButtonSx,
              visibility: "hidden",
              display: { sm: "flex", xs: "none" },
            }}
          />
          <InputField
            required
            sx={{ width: { md: 400, sm: 300 } }}
            value={character.name || ""}
            onChange={(val) => setCharacter({ ...character, name: val })}
            label={`${characterTypeMapping[type]} Name`}
          />
          <GenerateButton
            loading={generateLoading}
            disabled={generateLoading}
            onClick={handleGenerate}
            sx={loadingButtonSx}
          />
        </Stack>
      ) : (
        <Typography variant="h2" fontSize={44} textAlign="center">
          {character.name}
        </Typography>
      )}
      <Grid
        maxWidth="100%"
        container
        rowSpacing={1}
        columnSpacing={{ xs: 0, sm: 2 }}
        px={2}
        pt={1}
        pb={2}
        bgcolor={theme.palette.info.dark}
        borderRadius={4}
        sx={{ boxShadow }}
      >
        <Grid item xs={12} sm={4} {...center}>
          <Box
            width={isEditing ? "100%" : 230}
            height={230}
            position="relative"
            sx={{ ml: { xs: 0, sm: -2 } }}
          >
            {isEditing ? (
              <InputField
                fullWidth
                multiline
                rows={8.2}
                value={character.appearance || ""}
                onChange={(val) =>
                  setCharacter({ ...character, appearance: val, picture: null })
                }
                label="Appearance"
                sx={{ height: "100%" }}
              />
            ) : character.picture ? (
              <Image
                src={character.picture}
                alt={character.name || ""}
                sizes="200px"
                fill
                style={{
                  objectFit: "contain",
                  borderStyle: "solid",
                  borderWidth: "15px",
                  borderTopColor: "#333333",
                  borderRightColor: "#000",
                  borderBottomColor: "#333333",
                  borderLeftColor: "#000",
                  boxShadow: "2px 2px 4px rgba(0,0,0,.6)",
                }}
                priority
              />
            ) : (
              <ImageGenerating sx={{ width: "100%" }} />
            )}
          </Box>
        </Grid>
        <Grid item xs={12} sm={8} {...center}>
          <Grid container justifyContent="center" spacing={1} height="100%">
            {fields.map((field) => (
              <Grid
                item
                display="flex"
                justifyContent={{ sm: "flex-start", xs: "center" }}
                alignItems="center"
                key={field.label}
                md={4}
                sm={6}
                xs={12}
                width={isEditing ? 100 : undefined}
              >
                {isEditing ? (
                  <InputField {...field} />
                ) : (
                  <Detail {...field} extraLarge />
                )}
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default HeaderForm;

const GenerateButton = (props: LoadingButtonProps) => (
  <LoadingButton {...props}>
    Generate
    <FontAwesomeIcon icon={faRobot} fontSize={16} />
  </LoadingButton>
);
