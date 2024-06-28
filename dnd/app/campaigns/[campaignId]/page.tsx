"use client";

import {
  CampaignDocument,
  CampaignDocumentWithArcsArray,
  CampaignTab,
} from "@/lib/types";
import { Box, Divider, Stack, Tab, Tabs, Typography } from "@mui/material";
import CharacterGenerator from "@/components/tab-pages/CharacterGenerator";
import CampaignPlayer from "@/components/tab-pages/CampaignPlayer";
import MusicGenerator from "@/components/tab-pages/MusicGenerator";
import TimelineViewer from "@/components/tab-pages/TimelineViewer";
import theme from "@/lib/theme";
import { ReactNode, useContext, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGavel, faMap, faRoute } from "@fortawesome/free-solid-svg-icons";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import TimelineIcon from "@mui/icons-material/Timeline";
import { useUser } from "@/lib/hook";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import Loading from "@/components/Loading";
import { AudioContext } from "@/components/music/AudioProvider";
import AudioPlayer from "@/components/music/AudioPlayer";
import StopAudioButton from "@/components/music/StopAudioButton";
import { TabContext } from "@/components/tab-pages/TabProvider";
import { User } from "firebase/auth";
import MapGenerator from "@/components/tab-pages/MapGenerator";

type Props = {
  params: { campaignId: string };
};

type TabData = {
  value: CampaignTab;
  label: string;
  icon: ReactNode;
};
const fontIconStyle = {
  fontSize: 20,
};

const tabData: TabData[] = [
  {
    value: "character-generator",
    label: "Characters",
    icon: <FontAwesomeIcon icon={faGavel} style={fontIconStyle} />,
  },
  {
    value: "campaign-player",
    label: "Campaign",
    icon: <FontAwesomeIcon icon={faRoute} style={fontIconStyle} />,
  },
  {
    value: "map-generator",
    label: "Maps",
    icon: <FontAwesomeIcon icon={faMap} style={fontIconStyle} />,
  },

  {
    value: "music-generator",
    label: "Music",
    icon: <LibraryMusicIcon />,
  },
  {
    value: "timeline",
    label: "Timeline",
    icon: <TimelineIcon />,
  },
];

const CampaignPageComp = ({ params }: Props) => {
  const { data, isLoading } = useSWR(
    `/api/campaigns/${params.campaignId}`,
    fetcher
  );
  const { tab, goToTab } = useContext(TabContext);

  const campaignData = data as CampaignDocument | undefined;

  const characters = useMemo(() => {
    if (!campaignData) {
      return [];
    }
    const characterNames = Object.keys(campaignData.characters);
    const sortedCharacterNames = characterNames.sort();
    return sortedCharacterNames.map((key) => campaignData.characters[key]);
  }, [campaignData]);

  const npcs = useMemo(() => {
    if (!campaignData) {
      return [];
    }
    const characterNames = Object.keys(campaignData.npcs);
    const sortedCharacterNames = characterNames.sort();
    return sortedCharacterNames.map((key) => campaignData.npcs[key]);
  }, [campaignData]);

  const enemies = useMemo(() => {
    if (!campaignData) {
      return [];
    }
    const characterNames = Object.keys(campaignData.enemies);
    const sortedCharacterNames = characterNames.sort();
    return sortedCharacterNames.map((key) => campaignData.enemies[key]);
  }, [campaignData]);

  const arcs = useMemo(
    () => Object.values(campaignData?.arcs || {}),
    [campaignData]
  );

  const { user, unAuthenticated } = useUser();
  const router = useRouter();

  const { audioLink, audioSelected, audioVolume, audioPaused } =
    useContext(AudioContext);

  function handleTabClick(_: React.SyntheticEvent, newValue: CampaignTab) {
    goToTab(newValue);
  }

  const isTabDisabled = characters.length == 0;

  function colorTabIfDisabled(tabValue: CampaignTab) {
    return isTabDisabled && tabValue != "character-generator"
      ? "gray"
      : undefined;
  }

  if (unAuthenticated) {
    router.push("/"); // send them back to home so they can login
    return null;
  }

  if (isLoading || !campaignData) {
    return (
      <Stack flexGrow={1} justifyContent="space-evenly" alignItems="center">
        <Loading />
        <Loading sx={{ visibility: "hidden" }} />
        <Loading sx={{ visibility: "hidden" }} />
      </Stack>
    );
  }

  const campaignWithArcsArray: CampaignDocumentWithArcsArray = {
    ...campaignData,
    arcs,
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      position="relative"
      flexGrow={1}
      my={-2}
    >
      <Stack
        alignItems="center"
        flexGrow={1}
        py={2}
        sx={{
          width: { md: "90%", sm: "95%", xs: "100%" },
          bgcolor: theme.palette.primary.main,
          borderRadius: { sm: 5, xs: 0 },
        }}
        spacing={2}
      >
        <Tabs
          sx={{
            width: "100%",
            "& .MuiTabs-flexContainer": {
              justifyContent: { sm: "space-evenly" },
            },
          }}
          scrollButtons="auto"
          allowScrollButtonsMobile
          variant="scrollable"
          value={tab}
          onChange={handleTabClick}
          TabIndicatorProps={{
            style: {
              backgroundColor: theme.palette.secondary.main,
            },
          }}
          TabScrollButtonProps={{
            style: {
              color: theme.palette.primary.contrastText,
            },
          }}
        >
          {tabData.map((tab) => (
            <Tab
              sx={{ color: theme.palette.primary.contrastText }}
              key={tab.value}
              value={tab.value}
              disabled={characters.length == 0}
              label={
                <Stack
                  direction="row"
                  spacing={2}
                  color={colorTabIfDisabled(tab.value)}
                >
                  <Typography color={colorTabIfDisabled(tab.value)}>
                    {tab.label}
                  </Typography>
                  {tab.icon}
                </Stack>
              }
            />
          ))}
        </Tabs>
        <Stack spacing={2} px={4} py={2} width="100%" flexGrow={1}>
          <Divider flexItem />
          {tab == "character-generator" ? (
            <CharacterGenerator
              characters={characters}
              npcs={npcs}
              enemies={enemies}
              handleContinue={() => goToTab("campaign-player")}
            />
          ) : tab == "campaign-player" ? (
            <CampaignPlayer
              user={user as User}
              campaignId={params.campaignId}
              campaign={campaignWithArcsArray}
            />
          ) : tab == "map-generator" ? (
            <MapGenerator
              campaignId={params.campaignId}
              arcs={arcs}
              worldMap={campaignData.map}
            />
          ) : tab == "music-generator" ? (
            <MusicGenerator />
          ) : (
            <TimelineViewer
              campaignId={params.campaignId}
              arcs={arcs.slice(0, arcs.length - 1)} // don't show the current arc, only completed ones
              goToCampaignTab={() => goToTab("campaign-player")}
            />
          )}
        </Stack>
        {audioLink && audioSelected && (
          <AudioPlayer
            src={audioLink}
            paused={audioPaused}
            loop={
              audioSelected.type != "animals" &&
              audioSelected.type != "miscellaneous"
            }
            volume={audioVolume / 100}
            autoPlay
          />
        )}
        {audioLink && !audioPaused && tab != "music-generator" && (
          <StopAudioButton />
        )}
      </Stack>
    </Box>
  );
};

export default CampaignPageComp;
