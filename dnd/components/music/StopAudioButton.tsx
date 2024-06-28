import { Button, SvgIcon } from "@mui/material";
import React, { useContext, useState } from "react";
import WaveFormIcon from "@/components/WaveFormIcon";
import ClearIcon from "@mui/icons-material/Clear";
import { musicIconSx } from "@/lib/music-styles";
import { AudioContext } from "./AudioProvider";

const StopAudioButton = () => {
  const [isHovering, setIsHovering] = useState(false);
  const { setAudioPaused } = useContext(AudioContext);
  return (
    <Button
      onClick={() => setAudioPaused(true)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: 80,
        height: 80,
        borderRadius: "50%",
        position: "fixed",
        bottom: 40,
        right: 20,
        border: "1px solid lightgray",
      }}
    >
      {isHovering ? (
        <ClearIcon sx={{ ...musicIconSx, fontSize: 30 }} />
      ) : (
        <SvgIcon
          inheritViewBox
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <WaveFormIcon />
        </SvgIcon>
      )}
    </Button>
  );
};

export default StopAudioButton;
