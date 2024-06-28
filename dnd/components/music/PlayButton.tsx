"use client";
import { musicIconSx, musicPlayButtonSx } from "@/lib/music-styles";
import LoadingButton from "@mui/lab/LoadingButton";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseIcon from "@mui/icons-material/Pause";
import { useContext } from "react";
import { AudioContext } from "./AudioProvider";
import { AudioType } from "@/lib/types";

type Props = {
  type: AudioType;
  loading: boolean;
  error: boolean;
};

const PlayButton = ({ type, loading, error }: Props) => {
  const { audioSelected, audioPaused, setAudioPaused } =
    useContext(AudioContext);

  const isDisabled =
    !audioSelected || // we have not selected any audio whatsoever
    audioSelected.type != type || // we selected something in other audio page and are just viewing this page
    loading || // still fetching audio link
    error; // error fetching audio link

  function togglePlaying() {
    const isNotPlaying =
      !audioSelected || audioSelected.type != type || audioPaused;
    setAudioPaused(!isNotPlaying);
  }

  return (
    <LoadingButton
      sx={{ borderRadius: "50%", ...musicIconSx, p: 2 }}
      disabled={isDisabled}
      loading={loading || error}
      onClick={togglePlaying}
    >
      {audioSelected?.type == type && !audioPaused ? (
        <PauseIcon sx={musicPlayButtonSx} />
      ) : (
        <PlayCircleIcon sx={musicPlayButtonSx} />
      )}
    </LoadingButton>
  );
};

export default PlayButton;
