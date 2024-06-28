import { Character } from "@/lib/types";
import React from "react";
import HeaderForm from "./form/HeaderForm";
import Stack from "@mui/material/Stack";
import StatsAndProficienciesForm from "./form/StatsAndProficienciesForm";
import HealthAndEquipmentForm from "./form/HealthAndEquipmentForm";
import theme from "@/lib/theme";
import Detail from "./form/Detail";
import InputField from "./form/InputField";
import { boxShadow, characterFormWidth } from "@/lib/utils";
import AbilityScoresForm from "./form/AbilityScoresForm";

type Props = {
  character: Character;
  setCharacter: (c: Character) => void;
  isEditing: boolean;
  handleGenerate: () => void;
  generateLoading: boolean;
};

const CharacterFormLayout = ({
  character,
  setCharacter,
  isEditing,
  handleGenerate,
  generateLoading,
}: Props) => {
  return (
    <Stack spacing={4} width={characterFormWidth}>
      <HeaderForm
        character={character}
        setCharacter={setCharacter}
        isEditing={isEditing}
        handleGenerate={handleGenerate}
        generateLoading={generateLoading}
      />
      <Stack
        width="100%"
        bgcolor={theme.palette.info.dark}
        padding={isEditing ? 2 : 4}
        borderRadius={4}
        sx={{ boxShadow }}
      >
        {isEditing ? (
          <InputField
            onChange={(val) => setCharacter({ ...character, backstory: val })}
            multiline
            label="Description and Backstory"
            value={character.backstory || ""}
          />
        ) : (
          <Detail
            large
            label="Description and Backstory"
            value={character.backstory || ""}
          />
        )}
      </Stack>
      <AbilityScoresForm
        character={character}
        isEditing={isEditing}
        setCharacter={setCharacter}
      />
      <Stack direction="row" spacing={4}>
        <StatsAndProficienciesForm
          character={character}
          setCharacter={setCharacter}
          isEditing={isEditing}
        />
        <HealthAndEquipmentForm
          character={character}
          setCharacter={setCharacter}
          isEditing={isEditing}
        />
      </Stack>
    </Stack>
  );
};

export default CharacterFormLayout;
