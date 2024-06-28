import { Tone } from "@/lib/types";
import {
  IconDefinition,
  faAngry,
  faFaceGrinWide,
  faMeh,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ButtonBase, Paper, Stack, Typography } from "@mui/material";

function getToneIcon(tone: Tone): IconDefinition {
  switch (tone) {
    case "Friendly":
      return faFaceGrinWide;
    case "Neutral":
      return faMeh;
    case "Antagonistic":
      return faAngry;
    default: {
      const unknownTone: never = tone;
      throw Error(unknownTone);
    }
  }
}

function getToneColor(tone: Tone): string {
  switch (tone) {
    case "Friendly":
      return "green";
    case "Neutral":
      return "#2e5fc3";
    case "Antagonistic":
      return "#cf1e1e";
    default: {
      const unknownTone: never = tone;
      throw Error(unknownTone);
    }
  }
}

type Props = {
  text: string;
  tone: Tone;
  onClick: (selectedOutput: string) => void;
};

const AIOption = ({ text, tone, onClick }: Props) => {
  const titleFontSize = 18;
  return (
    <ButtonBase sx={{ height: "100%" }} onClick={() => onClick(text)}>
      <Paper
        sx={{
          p: 2,
          height: "100%",
          "&:hover": {
            backgroundColor: "#c7c7c7",
          },
          transition: "background-color 250ms ease",
        }}
      >
        <Stack alignItems="center" spacing={2}>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            <FontAwesomeIcon
              icon={getToneIcon(tone)}
              fontSize={titleFontSize}
              color={getToneColor(tone)}
            />
            <Typography
              fontSize={titleFontSize}
            >{`${tone} Suggestion`}</Typography>
          </Stack>

          <Typography textAlign="center">{text}</Typography>
        </Stack>
      </Paper>
    </ButtonBase>
  );
};

export default AIOption;
