"use client";
import React, {
  AudioHTMLAttributes,
  useContext,
  useEffect,
  useRef,
} from "react";
import { AudioContext } from "./AudioProvider";

type Props = {
  src: string;
  loop: boolean;
  volume: number;
  paused: boolean;
} & AudioHTMLAttributes<HTMLAudioElement>;

const AudioPlayer = ({ src, volume, loop, paused, ...other }: Props) => {
  const ref = useRef<HTMLAudioElement>(null);
  const { setAudioPaused } = useContext(AudioContext);

  useEffect(() => {
    if (ref.current) {
      ref.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (ref.current) {
      if (paused) {
        ref.current.pause();
      } else {
        ref.current.play();
      }
    }
  }, [paused]);

  useEffect(() => {
    if (ref.current && !loop) {
      const audioElement = ref.current;

      const handleAudioEnd = () => {
        audioElement.currentTime = 0; // rewind to start
        setAudioPaused(true);
      };

      audioElement.addEventListener("ended", handleAudioEnd);

      return () => {
        audioElement.removeEventListener("ended", handleAudioEnd);
      };
    }
  }, [loop, setAudioPaused]);

  return (
    <audio
      ref={ref}
      src={src}
      loop={loop}
      style={{ display: "none" }}
      {...other}
    />
  );
};

export default AudioPlayer;
