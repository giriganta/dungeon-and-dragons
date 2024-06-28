import { ReactNode, useContext } from "react";
import { secondaryButtonStyles } from "@/lib/theme";
import { Button, Paper, Stack, Typography } from "@mui/material";
import { AudioContext } from "./AudioProvider";
import { AudioType } from "@/lib/types";

type Props = {
  title: string;
  audioType: AudioType;
  onClick: () => void;
  icon: ReactNode;
};

const AudioCard = ({ title, audioType, onClick, icon }: Props) => {
  const { audioPaused, audioSelected, audioLink } = useContext(AudioContext);
  const isAudioPlayingForThisAudioType =
    audioLink && !audioPaused && audioSelected?.type == audioType;
  const extraButtonStyles = isAudioPlayingForThisAudioType
    ? {}
    : secondaryButtonStyles;

  return (
    <Paper sx={{ ...extraButtonStyles }} elevation={6}>
      <Button
        sx={{
          ...extraButtonStyles,
          py: { xs: 2, md: 3 },
          px: { xs: 2, md: 14 },
          width: { xs: 150, sm: 200 },
        }}
        onClick={onClick}
      >
        <Stack alignItems="center" width="100%" spacing={2}>
          <Typography fontSize={20} textAlign="center">
            {title}
          </Typography>
          {icon}
        </Stack>
      </Button>
    </Paper>
  );
};

export default AudioCard;
