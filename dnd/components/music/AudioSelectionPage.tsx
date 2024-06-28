import React, { ReactNode, useContext, useEffect } from "react";
import {
  AudioSelectedType,
  AudioType,
  AudioVariant,
  AudioVariantsMap,
} from "@/lib/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChampagneGlasses,
  faDragon,
  faDungeon,
  faExplosion,
  faHatWizard,
  faHorse,
  faRing,
  faStore,
  faUserSecret,
  faShoePrints,
  faCommentSlash,
  faGem,
  faDoorOpen,
} from "@fortawesome/free-solid-svg-icons";
import { musicButtonSxFun, musicFontAwesomeStyle } from "@/lib/music-styles";
import Hiking from "@mui/icons-material/Hiking";
import HeartBroken from "@mui/icons-material/HeartBroken";
import WaterDrop from "@mui/icons-material/WaterDrop";
import Thunderstorm from "@mui/icons-material/Thunderstorm";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import ForestIcon from "@mui/icons-material/Forest";
import SailingIcon from "@mui/icons-material/Sailing";
import PetsIcon from "@mui/icons-material/Pets";
import Air from "@mui/icons-material/Air";
import { Box, Button, Divider, Grid, Stack, Typography } from "@mui/material";
import PlayButton from "./PlayButton";
import { AudioContext } from "./AudioProvider";
import useSWR, { mutate } from "swr";
import fetcher from "@/lib/fetcher";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import VolumeSlider from "./VolumeSlider";
import { getAudio } from "@/lib/firebase-actions";

type Props = {
  title: string;
  audioType: AudioType;
  goBack: () => void;
};

type AudioSelectionChoice<T extends AudioType> = {
  title: string;
  variant: AudioVariantsMap[T];
  icon: ReactNode;
};

const musicChoices: AudioSelectionChoice<"music">[] = [
  {
    title: "Climax",
    variant: "climactic",
    icon: <FontAwesomeIcon icon={faExplosion} style={musicFontAwesomeStyle} />,
  },
  {
    title: "Adventure",
    variant: "adventurous",
    icon: <Hiking />,
  },
  {
    title: "Mystery",
    variant: "mysterious",
    icon: <FontAwesomeIcon icon={faUserSecret} style={musicFontAwesomeStyle} />,
  },
  {
    title: "Somber",
    variant: "somber",
    icon: <HeartBroken />,
  },
];

const weatherChoices: AudioSelectionChoice<"weather">[] = [
  {
    title: "Rainy",
    variant: "rainy",
    icon: <WaterDrop />,
  },
  {
    title: "Stormy",
    variant: "stormy",
    icon: <Thunderstorm />,
  },
  {
    title: "Windy",
    variant: "windy",
    icon: <Air />,
  },
  {
    title: "Blizzard",
    variant: "blizzard",
    icon: <AcUnitIcon />,
  },
];

const ambienceChoices: AudioSelectionChoice<"ambience">[] = [
  {
    title: "Forest",
    variant: "forest",
    icon: <ForestIcon />,
  },
  {
    title: "Dungeon",
    variant: "dungeon",
    icon: <FontAwesomeIcon icon={faDungeon} style={musicFontAwesomeStyle} />,
  },
  {
    title: "Tavern",
    variant: "tavern",
    icon: (
      <FontAwesomeIcon
        icon={faChampagneGlasses}
        style={musicFontAwesomeStyle}
      />
    ),
  },
  {
    title: "Market Square",
    variant: "market",
    icon: <FontAwesomeIcon icon={faStore} style={musicFontAwesomeStyle} />,
  },
  {
    title: "Cave",
    variant: "cave",
    icon: <FontAwesomeIcon icon={faRing} style={musicFontAwesomeStyle} />,
  },
  {
    title: "Ship",
    variant: "ship",
    icon: <SailingIcon />,
  },
];

const animalChoices: AudioSelectionChoice<"animals">[] = [
  {
    title: "Horse",
    variant: "horse",
    icon: <FontAwesomeIcon icon={faHorse} style={musicFontAwesomeStyle} />,
  },
  {
    title: "Wolf",
    variant: "wolf",
    icon: <PetsIcon />,
  },
  {
    title: "Dragon",
    variant: "dragon",
    icon: <FontAwesomeIcon icon={faDragon} style={musicFontAwesomeStyle} />,
  },
];

const miscChoices: AudioSelectionChoice<"miscellaneous">[] = [
  {
    title: "Footsteps",
    variant: "footsteps",
    icon: <FontAwesomeIcon icon={faShoePrints} style={musicFontAwesomeStyle} />,
  },
  {
    title: "Door Opening",
    variant: "door-opening",
    icon: <FontAwesomeIcon icon={faDoorOpen} style={musicFontAwesomeStyle} />,
  },
  {
    title: "Whispers",
    variant: "whispers",
    icon: (
      <FontAwesomeIcon icon={faCommentSlash} style={musicFontAwesomeStyle} />
    ),
  },
  {
    title: "Treasure",
    variant: "treasure",
    icon: <FontAwesomeIcon icon={faGem} style={musicFontAwesomeStyle} />,
  },
  {
    title: "Spell",
    variant: "spell",
    icon: <FontAwesomeIcon icon={faHatWizard} style={musicFontAwesomeStyle} />,
  },
];

type SelectionMapType = {
  [key in AudioType]: AudioSelectionChoice<key>[];
};

const selectionMap: SelectionMapType = {
  music: musicChoices,
  weather: weatherChoices,
  ambience: ambienceChoices,
  animals: animalChoices,
  miscellaneous: miscChoices,
};

const AudioSelectionPage = ({ title, audioType, goBack }: Props) => {
  const { audioSelected, setAudioSelected, setAudioLink } =
    useContext(AudioContext);

  const apiURL = (audioSelection: AudioSelectedType) =>
    `/api/audio?type=${audioSelection.type}&variant=${audioSelection.variant}`;

  const { data, isLoading, error } = useSWR(
    audioSelected ? apiURL(audioSelected) : null,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  useEffect(() => setAudioLink(data), [data, setAudioLink]);

  function handleVariantClick(variant: AudioVariant) {
    if (audioSelected?.variant == variant) {
      setAudioSelected(null);
    } else {
      const newSelection = {
        type: audioType,
        variant: variant,
      } as AudioSelectedType;

      mutate(
        apiURL(newSelection),
        getAudio(newSelection.type, newSelection.variant)
      );
      setAudioSelected(newSelection);
    }
  }

  return (
    <Stack alignItems="center" width="100%" spacing={1} pt={4}>
      <Stack>
        <Typography variant="h2" fontSize={40} gutterBottom>
          {title}
        </Typography>
        <Divider flexItem sx={{ width: "175%", alignSelf: "center" }} />
      </Stack>
      <Grid
        container
        rowSpacing={4}
        columnSpacing={1}
        justifyContent="center"
        width={{ xs: "100%", sm: "90%", md: "65%" }}
      >
        {selectionMap[audioType].map((variantSelection) => (
          <Grid
            key={variantSelection.variant}
            item
            xs={6}
            sm={4}
            md={3}
            display="flex"
            justifyContent="center"
          >
            <Button
              onClick={() => handleVariantClick(variantSelection.variant)}
              sx={musicButtonSxFun(
                audioSelected?.type == audioType &&
                  audioSelected?.variant == variantSelection.variant
              )}
            >
              {variantSelection.title} {variantSelection.icon}
            </Button>
          </Grid>
        ))}
      </Grid>
      <Stack
        pt={10}
        direction="row"
        spacing={4}
        width="100%"
        justifyContent={{ xs: "space-evenly", sm: "center" }}
      >
        <Box alignSelf="center">
          <Button
            sx={{
              display: "flex",
              px: 2,
              py: 1,
              gap: 1,
            }}
            onClick={goBack}
          >
            <ChevronLeft sx={{ ml: -1 }} />
            <Typography variant="button">Go Back</Typography>
          </Button>
        </Box>
        <Box
          alignSelf="center"
          width={200}
          display={{ xs: "none", sm: "block" }}
        >
          <VolumeSlider />
        </Box>
        <PlayButton
          type={audioType}
          loading={isLoading}
          error={Boolean(error)}
        />
      </Stack>
    </Stack>
  );
};

export default AudioSelectionPage;
