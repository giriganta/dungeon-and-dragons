import { Grid, Stack, useMediaQuery } from "@mui/material";
import TabTitle from "@/components/TabTitle";

import theme from "@/lib/theme";
import { musicFontAwesomeStyle, musicIconSx } from "@/lib/music-styles";
import { ReactNode, useContext } from "react";
import LibraryMusic from "@mui/icons-material/LibraryMusic";
import ThunderstormIcon from "@mui/icons-material/Thunderstorm";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import AudioCard from "../music/AudioCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDragon } from "@fortawesome/free-solid-svg-icons";
import { AudioType } from "@/lib/types";
import AudioSelectionPage from "../music/AudioSelectionPage";
import { TabContext } from "./TabProvider";

type AudioCardData<T extends AudioType> = {
  title: string;
  audioType: T;
  icon: ReactNode;
};

const MusicPage = () => {
  const mobileScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const { musicTypeQuery, setMusicTypeQuery } = useContext(TabContext);
  const audioCards: { [key in AudioType]: AudioCardData<key> } = {
    music: {
      title: "Music",
      audioType: "music",
      icon: <LibraryMusic sx={musicIconSx} />,
    },
    weather: {
      title: "Weather",
      audioType: "weather",
      icon: <ThunderstormIcon sx={musicIconSx} />,
    },
    ambience: {
      title: "Ambience",
      audioType: "ambience",
      icon: <GraphicEqIcon sx={musicIconSx} />,
    },
    animals: {
      title: "Animals",
      audioType: "animals",
      icon: <FontAwesomeIcon icon={faDragon} style={musicFontAwesomeStyle} />,
    },
    miscellaneous: {
      title: mobileScreen ? "Misc" : "Miscellaneous",
      audioType: "miscellaneous",
      icon: <MusicNoteIcon sx={musicIconSx} />,
    },
  };

  return (
    <Stack spacing={2} alignItems="center" flexGrow={1}>
      <TabTitle title="Music Generator" fragment="music-generator" />

      {musicTypeQuery != null ? (
        <AudioSelectionPage
          audioType={musicTypeQuery}
          title={audioCards[musicTypeQuery].title}
          goBack={() => setMusicTypeQuery(null)}
        />
      ) : (
        <Grid
          container
          justifyContent="center"
          rowSpacing={6}
          width={{ xs: "100%", sm: "90%", md: "80%", lg: "70%" }}
        >
          {Object.values(audioCards).map((audioCardData) => (
            <Grid
              xs={12}
              sm={6}
              md={4}
              item
              key={audioCardData.audioType}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <AudioCard
                {...audioCardData}
                onClick={() => setMusicTypeQuery(audioCardData.audioType)}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Stack>
  );
};

export default MusicPage;
