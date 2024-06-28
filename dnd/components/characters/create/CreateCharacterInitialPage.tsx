import {
  Button,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { faCircleLeft, faRobot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CreateIcon from "@mui/icons-material/Create";
import { ReactNode, useContext, useState } from "react";
import { TabContext } from "../../tab-pages/TabProvider";
import AddCharacterView from "./AddCharacterView";
import { secondaryButtonStyles } from "@/lib/theme";
import { center } from "@/lib/utils";
import PromptModal from "@/components/PromptModal";

type SelectButtonProps = {
  text: string;
  icon: ReactNode;
  type: SelectedOption;
};

export type SelectedOption = "AI" | "manual";

const CreateCharacterInitialPage = () => {
  const { createCharacterQuery, setCreateCharacterQuery } =
    useContext(TabContext);
  const [aiPrompt, setAIPrompt] = useState("");
  const [optionSelected, setOptionSelected] = useState<SelectedOption | null>(
    null
  );

  function handleCloseModal() {
    setOptionSelected(null);
    setAIPrompt("");
  }

  const SelectButton = ({ text, icon, type }: SelectButtonProps) => {
    return (
      <Grid item xs={12} sm={5} {...center}>
        <Button
          sx={{
            ...secondaryButtonStyles,
            p: 3,
            height: { sm: "100%" },
            width: { xs: "90%", sm: undefined },
          }}
          onClick={() => setOptionSelected(type)}
        >
          <Stack spacing={1} alignItems="center">
            <Typography fontSize={18} variant="button">
              {text}
            </Typography>
            {icon}
          </Stack>
        </Button>
      </Grid>
    );
  };

  if (optionSelected == "manual") {
    return (
      <AddCharacterView
        userPrompt={aiPrompt}
        resetUserPrompt={() => setAIPrompt("")}
        goBack={() => setOptionSelected(null)}
      />
    );
  }
  const isCharacter = createCharacterQuery == "character";

  return (
    <Stack
      flexGrow={1}
      justifyContent="center"
      alignItems="center"
      position="relative"
    >
      <Tooltip title="Go Back">
        <IconButton
          sx={{
            position: "absolute",
            top: { sm: 5, xs: -10 },
            left: 10,
          }}
          onClick={() => setCreateCharacterQuery(null)}
        >
          <FontAwesomeIcon icon={faCircleLeft} fontSize={30} />
        </IconButton>
      </Tooltip>
      <Grid
        container
        // direction={{ sm: "row", xs: "column" }}
        width={{ md: "70%", sm: "90%", xs: "100%" }}
        justifyContent="center"
        alignItems="stretch"
        position="relative"
        spacing={{ md: 5, sm: 0, xs: 2 }}
      >
        <SelectButton
          text={`Create ${isCharacter ? "a" : "an"} ${createCharacterQuery} with AI`}
          icon={<FontAwesomeIcon icon={faRobot} fontSize={20} />}
          type="AI"
        />
        <Grid item xs={2} {...center}>
          <Typography fontSize={20}>OR</Typography>
        </Grid>
        <SelectButton
          text={`Create ${isCharacter ? "a" : "an"} ${createCharacterQuery} manually`}
          icon={<CreateIcon />}
          type="manual"
        />
      </Grid>
      <PromptModal
        open={optionSelected == "AI"}
        onClose={handleCloseModal}
        prompt={aiPrompt}
        onChange={setAIPrompt}
        title={`Give some initial details on what you want your ${createCharacterQuery} to be like`}
        description={`This will help the AI with creating your ${createCharacterQuery}`}
        onSubmit={() => setOptionSelected("manual")}
      />
    </Stack>
  );
};

export default CreateCharacterInitialPage;
