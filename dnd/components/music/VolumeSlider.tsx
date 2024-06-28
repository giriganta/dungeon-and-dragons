import { musicIconSx } from "@/lib/music-styles";
import theme from "@/lib/theme";
import VolumeDown from "@mui/icons-material/VolumeDown";
import VolumeOff from "@mui/icons-material/VolumeOff";
import VolumeUp from "@mui/icons-material/VolumeUp";
import { Slider, Stack } from "@mui/material";
import React, { useContext } from "react";
import { AudioContext } from "./AudioProvider";

const VolumeSlider = () => {
  const { audioVolume, setAudioVolume } = useContext(AudioContext);
  return (
    <Stack
      spacing={2}
      direction="row"
      alignItems="center"
      justifyContent="center"
    >
      {audioVolume ? (
        <VolumeDown
          sx={{ ...musicIconSx, "&:hover": { cursor: "pointer" } }}
          onClick={() => setAudioVolume(0)}
        />
      ) : (
        <VolumeOff sx={musicIconSx} />
      )}
      <Slider
        aria-label="Volume"
        onChange={(_, newValue) => setAudioVolume(newValue as number)}
        sx={{
          color: theme.palette.primary.contrastText,
          "& .MuiSlider-thumb": {
            "&:hover, &.Mui-focusVisible": {
              boxShadow: `0px 0px 0px 8px rgba(255, 255, 255, 0.16)`, // White color with some transparency
            },
            "&.Mui-active": {
              boxShadow: `0px 0px 0px 14px rgba(255, 255, 255, 0.16)`, // Increase the size for the active state if needed
            },
          },
        }}
        value={audioVolume}
      />
      <VolumeUp sx={musicIconSx} />
    </Stack>
  );
};

export default VolumeSlider;
