import React, { useCallback, useContext, useEffect, useState } from "react";
import { Button, Stack } from "@mui/material";
import {
  addNewCharacter,
  generatePictureForCharacter,
} from "@/lib/firebase-mutate-actions";
import { AIPrompt, Character, CharacterType, PageParams } from "@/lib/types";
import { useParams } from "next/navigation";
import LoadingButton from "@mui/lab/LoadingButton";
import { TabContext } from "../../tab-pages/TabProvider";
import CharacterFormLayout from "./CharacterFormLayout";
import { secondaryButtonStyles } from "@/lib/theme";
import { useStreamedResponse } from "@/lib/hook";
import {
  DEFAULT_CHAR_AI_PROMPT,
  firebaseCharacterTypeMapping,
  getCharacterPrompt,
  isDeepEqual,
  parseGPTCharacterOutput,
} from "@/lib/utils";
import DeleteModal from "@/components/DeleteModal";

type Props = {
  userPrompt: string;
  resetUserPrompt: () => void;
  goBack: () => void;
};

const initialCharacterInfo: Character = {
  equipment_array: [],
  spells: [],
  proficiencies_array: [],
  abilities: {
    Strength: {},
    Dexterity: {},
    Constitution: {},
    Intelligence: {},
    Wisdom: {},
    Charisma: {},
  },
  saving_throws: {
    Strength: { proficient: false },
    Dexterity: { proficient: false },
    Constitution: { proficient: false },
    Intelligence: { proficient: false },
    Wisdom: { proficient: false },
    Charisma: { proficient: false },
  },
  skills: {
    Acrobatics: { proficient: false },
    "Animal Handling": { proficient: false },
    Arcana: { proficient: false },
    Athletics: { proficient: false },
    Deception: { proficient: false },
    History: { proficient: false },
    Insight: { proficient: false },
    Intimidation: { proficient: false },
    Investigation: { proficient: false },
    Medicine: { proficient: false },
    Nature: { proficient: false },
    Perception: { proficient: false },
    Performance: { proficient: false },
    Persuasion: { proficient: false },
    Religion: { proficient: false },
    "Sleight of Hand": { proficient: false },
    Stealth: { proficient: false },
    Survival: { proficient: false },
  },
  weapons_array: [],
  traits_array: [],
  successes: [false, false, false],
  failures: [false, false, false],
  picture: "",
};

const buttonSx = {
  py: 1.5,
  px: 2.5,
  fontSize: 16,
  borderRadius: 1.5,
};

const AddCharacterView = ({ userPrompt, resetUserPrompt, goBack }: Props) => {
  const { createCharacterQuery, setCreateCharacterQuery, toastCharacter } =
    useContext(TabContext);
  const params = useParams<PageParams>();
  const campaignId = params.campaignId as string;
  const [submitLoading, setSubmitLoading] = useState(false);
  const [newCharacterInfo, setNewCharacterInfo] = useState<Character>(
    structuredClone(initialCharacterInfo)
  );
  const [modalOpen, setModalOpen] = useState(false);

  const [aiPrompt, setAiPrompt] = useState<AIPrompt>(DEFAULT_CHAR_AI_PROMPT);
  /* This will be used if we want to redo gpt's responses - this object gets populated with the textfields that were sent to gpt to generate */
  // const [textFieldsForAi, setTextFieldsForAi] = useState<
  //   Record<string, boolean>
  // >({});
  const { streamedData, setStreamedData, done } = useStreamedResponse(aiPrompt);
  const [aiLoading, setAiLoading] = useState(false);

  const handleGenerate = useCallback(() => {
    setStreamedData("");
    const prompt = getCharacterPrompt(newCharacterInfo, userPrompt);
    if (prompt) {
      setAiPrompt({ ...aiPrompt, prompt });
      setAiLoading(true);
    }
  }, [aiPrompt, newCharacterInfo, setStreamedData, userPrompt]);

  useEffect(() => {
    if (done) {
      setAiLoading(false);
    }
  }, [done]);

  useEffect(() => {
    if (userPrompt) {
      handleGenerate();
      resetUserPrompt(); // make sure we only generate once using their prompt
    }
  }, [handleGenerate, userPrompt, resetUserPrompt]);

  useEffect(() => {
    parseGPTCharacterOutput(
      streamedData,
      newCharacterInfo,
      setNewCharacterInfo
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streamedData]);

  function goBackToCharacterViewer() {
    setCreateCharacterQuery(null);
  }

  async function handleCreateCharacter() {
    const type =
      firebaseCharacterTypeMapping[createCharacterQuery as CharacterType];
    setSubmitLoading(true);
    newCharacterInfo.picture = ""; // explicitly state to ui that we are generating the character portrait
    await addNewCharacter(campaignId, newCharacterInfo, type);
    // generate picture asynchronously
    generatePictureForCharacter(campaignId, newCharacterInfo, type, () =>
      toastCharacter(campaignId, newCharacterInfo.name as string)
    );
    goBackToCharacterViewer();
  }

  function handleGoBack() {
    if (isDeepEqual(newCharacterInfo, initialCharacterInfo)) {
      goBack();
    } else {
      // else user has typed in some data, so show modal
      setModalOpen(true);
    }
  }

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCreateCharacter();
        }}
      >
        <Stack spacing={4} alignItems="center">
          <CharacterFormLayout
            character={newCharacterInfo}
            setCharacter={setNewCharacterInfo}
            isEditing
            handleGenerate={handleGenerate}
            generateLoading={aiLoading}
          />
          <Stack direction="row" justifyContent="center" spacing={4}>
            <Button
              variant="contained"
              onClick={handleGoBack}
              sx={{ ...secondaryButtonStyles, ...buttonSx }}
            >
              Go Back
            </Button>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={submitLoading}
              disabled={submitLoading}
              sx={buttonSx}
            >
              Create Character
            </LoadingButton>
          </Stack>
        </Stack>
      </form>
      <DeleteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Are you sure you want to go back?"
        description="By leaving this page, you will lose your unsaved character"
        onSubmit={goBack}
        loading={false}
        negativeText="No, Cancel"
        positiveText="Yes, Go Back"
      />
    </>
  );
};

export default AddCharacterView;
