import { musicFontAwesomeStyle } from "@/lib/music-styles";
import { AIPrompt, Character, CharacterType, PageParams } from "@/lib/types";
import { faFilePdf, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, IconButton, Stack, Tooltip } from "@mui/material";
import {
  DEFAULT_CHAR_AI_PROMPT,
  characterFormWidth,
  characterSheetFilename,
  characterTypeMapping,
  firebaseCharacterTypeMapping,
  getCharacterPrompt,
  parseGPTCharacterOutput,
} from "@/lib/utils";
import { useCallback, useContext, useEffect, useState } from "react";
import CharacterFormLayout from "../create/CharacterFormLayout";
import theme, { secondaryButtonStyles } from "@/lib/theme";
import axios from "axios";
import { useSnackbar } from "notistack";
import Loading from "@/components/Loading";
import {
  deleteCharacter,
  generatePictureForCharacter,
  replaceCharacter,
} from "@/lib/firebase-mutate-actions";
import LoadingButton from "@mui/lab/LoadingButton";
import { useParams } from "next/navigation";
import Delete from "@mui/icons-material/Delete";
import DeleteModal from "@/components/DeleteModal";
import { useStreamedResponse } from "@/lib/hook";
import { TabContext } from "@/components/tab-pages/TabProvider";

const iconButtonStyle = { p: 1.5 };

type Props = {
  character: Character;
  type: CharacterType;
};

const CharacterDetails = ({ character, type }: Props) => {
  const params = useParams<PageParams>();
  const campaignId = params.campaignId as string;
  const { enqueueSnackbar } = useSnackbar();
  const { toastCharacter } = useContext(TabContext);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [characterInfo, setCharacterInfo] = useState(character);

  const [aiPrompt, setAiPrompt] = useState<AIPrompt>(DEFAULT_CHAR_AI_PROMPT);
  const { streamedData, setStreamedData, done } = useStreamedResponse(aiPrompt);
  const [aiLoading, setAiLoading] = useState(false);

  const handleGenerate = useCallback(() => {
    setStreamedData("");
    const prompt = getCharacterPrompt(characterInfo);
    if (prompt) {
      setAiPrompt({ ...aiPrompt, prompt });
      setAiLoading(true);
    }
  }, [aiPrompt, characterInfo, setStreamedData]);

  useEffect(() => {
    if (done) {
      setAiLoading(false);
    }
  }, [done]);

  useEffect(() => {
    parseGPTCharacterOutput(streamedData, characterInfo, setCharacterInfo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streamedData]);

  async function downloadModifiedPdf() {
    try {
      setPdfLoading(true);
      const response = await axios.post(
        "/api/export_pdf",
        { character },
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;

      a.download = characterSheetFilename(character.name || "");
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      enqueueSnackbar("Error producing your character sheet", {
        variant: "error",
      });
    } finally {
      setPdfLoading(false);
    }
  }

  async function handleSubmitChanges() {
    setSubmitLoading(true);

    const firebaseCharacterType = firebaseCharacterTypeMapping[type];
    await replaceCharacter(
      campaignId,
      character.name as string,
      characterInfo,
      firebaseCharacterType
    );
    if (characterInfo.picture === null) {
      // then that means we edited the appearance of the character, so regenerate the character portrait
      generatePictureForCharacter(
        campaignId,
        characterInfo,
        firebaseCharacterType,
        () => toastCharacter(campaignId, characterInfo.name as string),
        character.picture as string // the old picture to delete from storage
      );
    }
    setSubmitLoading(false);
    setIsEditing(false);
  }

  async function handleDeleteCharacter() {
    setSubmitLoading(true);
    await deleteCharacter(campaignId, character.name as string);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmitChanges();
      }}
    >
      <Stack alignItems="center" width="100%" spacing={3}>
        <Stack
          width={characterFormWidth}
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          spacing={isEditing ? 2 : 1}
        >
          {isEditing ? (
            <>
              <Button
                sx={secondaryButtonStyles}
                onClick={() => {
                  setIsEditing(false);
                  setCharacterInfo(character);
                }}
              >
                Cancel
              </Button>
              <LoadingButton
                type="submit"
                loading={submitLoading}
                disabled={submitLoading || aiLoading}
              >
                Submit
              </LoadingButton>
            </>
          ) : (
            <>
              <Box>
                <Tooltip title={`Edit ${characterTypeMapping[type]}`}>
                  <IconButton
                    sx={iconButtonStyle}
                    onClick={() => setIsEditing(true)}
                  >
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      style={musicFontAwesomeStyle}
                    />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box>
                <Tooltip
                  title={
                    !character.picture ? "Portrait Generating" : "Export to PDF"
                  }
                >
                  <span>
                    <IconButton
                      sx={iconButtonStyle}
                      onClick={downloadModifiedPdf}
                      disabled={pdfLoading || !character.picture}
                    >
                      {pdfLoading ? (
                        <Loading size={22} />
                      ) : (
                        <FontAwesomeIcon
                          icon={faFilePdf}
                          style={{
                            ...musicFontAwesomeStyle,
                            color: !character.picture
                              ? "gray"
                              : theme.palette.primary.contrastText,
                          }}
                        />
                      )}
                    </IconButton>
                  </span>
                </Tooltip>
              </Box>
              <Box>
                <Tooltip title="Delete Character">
                  <IconButton onClick={() => setModalOpen(true)}>
                    <Delete />
                  </IconButton>
                </Tooltip>
              </Box>
            </>
          )}
        </Stack>
        <CharacterFormLayout
          character={characterInfo}
          setCharacter={setCharacterInfo}
          isEditing={isEditing}
          handleGenerate={handleGenerate}
          generateLoading={aiLoading}
        />
        <DeleteModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Confirm Delete Character"
          description={`Are you sure you want to delete ${character.name}? All data for this character will be lost.`}
          loading={submitLoading}
          onSubmit={handleDeleteCharacter}
        />
      </Stack>
    </form>
  );
};

export default CharacterDetails;
