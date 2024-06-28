import { Character, CharacterType } from "@/lib/types";
import { Box, Button, Stack, Typography } from "@mui/material";
import React, { useContext } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TabTitle from "../TabTitle";
import { TabContext } from "./TabProvider";
import CharacterCardGrid from "../characters/list/CharacterCardGrid";
import CreateCharacterInitialPage from "../characters/create/CreateCharacterInitialPage";
import CharacterDetails from "../characters/details/CharacterDetails";

type Props = {
  characters: Character[];
  npcs: Character[];
  enemies: Character[];
  handleContinue: () => void;
};

const CharacterPage = ({
  characters,
  npcs,
  enemies,
  handleContinue,
}: Props) => {
  const {
    characterQuery,
    setCharacterQuery,
    npcQuery,
    setNpcQuery,
    enemyQuery,
    setEnemyQuery,
    createCharacterQuery,
    setCreateCharacterQuery,
  } = useContext(TabContext);

  if (characterQuery || npcQuery || enemyQuery) {
    const characterList = characterQuery ? characters : npcs;
    const characterType: CharacterType = characterQuery
      ? "character"
      : npcQuery
        ? "npc"
        : "enemy";
    const query = characterQuery || npcQuery || enemyQuery;

    const characterToShowDetailsFor = characterList.find(
      (ch) => ch.name == query
    );
    if (!characterToShowDetailsFor) {
      // if we try to go to a character detail page for a character that doesn't exist
      setCharacterQuery(null);
      setNpcQuery(null);
      setEnemyQuery(null);
      return null;
    }
    return (
      <CharacterDetails
        character={characterToShowDetailsFor}
        type={characterType}
      />
    );
  }

  if (createCharacterQuery) {
    return <CreateCharacterInitialPage />;
  }

  return (
    <Stack alignItems="center" spacing={2} flexGrow={1}>
      <TabTitle title="Character Generator" fragment="character-generator" />
      {characters.length > 0 ? (
        <Stack spacing={2} width="100%" alignItems="center" pt={2}>
          <CharacterCardGrid
            type="character"
            title="Playable Characters"
            characters={characters}
            handleAddCharacter={() =>
              setCreateCharacterQuery("character", { history: "push" })
            }
          />
          <CharacterCardGrid
            type="npc"
            title="NPCs"
            characters={npcs}
            handleAddCharacter={() =>
              setCreateCharacterQuery("npc", { history: "push" })
            }
          />
          <CharacterCardGrid
            type="enemy"
            title="Enemies"
            characters={enemies}
            handleAddCharacter={() =>
              setCreateCharacterQuery("enemy", { history: "push" })
            }
          />
        </Stack>
      ) : (
        <Stack alignItems="center" pt={4} spacing={4}>
          <Typography textAlign="center" variant="h3" fontSize={28}>
            Start your Campaign by Creating a Character
          </Typography>
          <Button
            sx={{
              fontSize: 20,
              py: 1.5,
              px: { xs: 3.5, sm: 6 },
            }}
            variant="contained"
            onClick={() =>
              setCreateCharacterQuery("character", { history: "push" })
            }
          >
            Create Character
          </Button>
        </Stack>
      )}
      {characters.length == 0 && <div style={{ flexGrow: 1 }} />}
      <Box width="100%" position="relative" pt={{ xs: 6, md: 4 }}>
        <Button
          disabled={characters.length == 0}
          onClick={handleContinue}
          sx={{
            fontSize: 16,
            px: 2,
            py: 1,
            position: "absolute",
            right: { xs: 0, md: 16 },
            bottom: 0,
          }}
        >
          Continue <ChevronRightIcon sx={{ mr: -1, ml: 1 }} />
        </Button>
      </Box>
    </Stack>
  );
};

export default CharacterPage;
