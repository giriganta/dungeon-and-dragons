import { Grid, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import AIOption from "./AIOption";
import Loading from "../Loading";
import RefreshIcon from "@mui/icons-material/Refresh";
import { secondaryButtonStyles } from "@/lib/theme";

type Props = {
  streamedData: string;
  onClick: (selectedOutput: string) => void;
  redoResponse: () => void;
};

const AIOptionGrid = ({ streamedData, onClick, redoResponse }: Props) => {
  const [friendlyText, setFriendlyText] = useState("");
  const [neutralText, setNeutralText] = useState("");
  const [antagonisticText, setAntagonisticText] = useState("");

  useEffect(() => {
    const extractText = (label: string, nextLabel: string) => {
      const startIndex = streamedData.indexOf(label) + label.length;
      const endIndex = nextLabel
        ? streamedData.indexOf(nextLabel, startIndex)
        : streamedData.length;
      return streamedData
        .substring(startIndex, endIndex !== -1 ? endIndex : undefined)
        .trim();
    };

    const friendlyLabel = "Friendly: ";
    const neutralLabel = "\n\nNeutral: ";
    const antagonisticLabel = "\n\nAntagonistic: ";

    setFriendlyText(extractText(friendlyLabel, neutralLabel));
    setNeutralText(extractText(neutralLabel, antagonisticLabel));
    setAntagonisticText(extractText(antagonisticLabel, ""));
  }, [streamedData]);

  if (!friendlyText) {
    // then nothing has been streamed to the API yet since friendly text is the first to
    // get streamed to the UI
    return (
      <Stack flexGrow={1}>
        <Loading />
      </Stack>
    );
  }

  return (
    <Stack alignItems="center" spacing={2}>
      <Stack
        direction="row"
        spacing={3}
        alignItems="center"
        justifyContent="center"
      >
        <IconButton
          sx={{ ...secondaryButtonStyles, visibility: "hidden" }}
          onClick={redoResponse}
        >
          <RefreshIcon />
        </IconButton>
        <Typography variant="h3" fontSize={22}>
          Pick your Favorite Suggestion
        </Typography>
        <Tooltip title="Ask AI Again">
          <IconButton sx={secondaryButtonStyles} onClick={redoResponse}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Stack>
      <Grid
        flexGrow={1}
        container
        justifyContent="center"
        alignItems="stretch"
        spacing={1}
      >
        {friendlyText && (
          <Grid item xs={12} sm={6} md={4}>
            <AIOption text={friendlyText} tone="Friendly" onClick={onClick} />
          </Grid>
        )}
        {neutralText && (
          <Grid item xs={12} sm={6} md={4}>
            <AIOption text={neutralText} tone="Neutral" onClick={onClick} />
          </Grid>
        )}
        {antagonisticText && (
          <Grid item xs={12} sm={6} md={4}>
            <AIOption
              text={antagonisticText}
              tone="Antagonistic"
              onClick={onClick}
            />
          </Grid>
        )}
      </Grid>
    </Stack>
  );
};

export default AIOptionGrid;
