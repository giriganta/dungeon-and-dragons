import { AudioSelectedType } from "@/lib/types";
import { createContext, useState } from "react";

type Props = {
  children: React.ReactNode;
};

type AudioContextType = {
  audioSelected: AudioSelectedType | null;
  setAudioSelected: (playing: AudioSelectedType | null) => void;

  audioPaused: boolean;
  setAudioPaused: (paused: boolean) => void;

  audioVolume: number;
  setAudioVolume: (volume: number) => void;

  audioLink: string | undefined;
  setAudioLink: (link: string | undefined) => void;
};

// Provide a default value that matches the shape of AudioContextType
const defaultAudioContextValue: AudioContextType = {
  audioSelected: null,
  setAudioSelected: () => {}, // No-op function for default

  audioPaused: true,
  setAudioPaused: () => {}, // No-op function for default

  audioVolume: 100, // Default volume or placeholder value
  setAudioVolume: () => {}, // No-op function for default

  audioLink: undefined,
  setAudioLink: () => {}, // No-op function for default
};

export const AudioContext = createContext(defaultAudioContextValue);

const AudioProvider = ({ children }: Props) => {
  const [audioSelected, setAudioSelected] = useState<AudioSelectedType | null>(
    null
  );

  const [audioPaused, setAudioPaused] = useState(true);

  const [audioVolume, setAudioVolume] = useState(100);

  // the links to these audio samples from firebase (which will be added to the src prop of the <audio/> tag)
  const [audioLink, setAudioLink] = useState<string>();

  const value = {
    audioSelected,
    setAudioSelected,

    audioPaused,
    setAudioPaused,

    audioVolume,
    setAudioVolume,

    audioLink,
    setAudioLink,
  };

  return (
    <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
  );
};

export default AudioProvider;
