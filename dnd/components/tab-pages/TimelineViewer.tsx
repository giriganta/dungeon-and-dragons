import {
  Button,
  Divider,
  Modal,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import React, { useContext, useState } from "react";
import TabTitle from "../TabTitle";
import TimelineCard from "../timeline/TimelineCard";
import { StoryArc } from "@/lib/types";
import { secondaryButtonStyles } from "@/lib/theme";
import { rewindCampaign } from "@/lib/firebase-mutate-actions";
import { useSmoothScroll } from "@/lib/hook";
import { TabContext } from "./TabProvider";

type Props = {
  campaignId: string;
  arcs: StoryArc[];
  goToCampaignTab: () => void;
};

const TimelinePage = ({ campaignId, arcs, goToCampaignTab }: Props) => {
  const { campaignTimelineQuery } = useContext(TabContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [eventIndex, setEventIndex] = useState(0);
  useSmoothScroll(campaignTimelineQuery);

  function closeModal() {
    setModalOpen(false);
  }

  function openModal(eventIndexToRewindTo: number) {
    setEventIndex(eventIndexToRewindTo);
    setModalOpen(true);
  }

  async function handleRewind() {
    closeModal();
    // since arcs array is reversed, eventIndex 0 corresponds to end of arcs array
    // while eventIndex = arcs.length - 1 corresponds to start of array
    const adjustedIndex = arcs.length - eventIndex;
    await rewindCampaign(campaignId, arcs.slice(0, adjustedIndex));
    goToCampaignTab();
  }

  const modalButtonSx = {
    py: 1,
    px: 3,
  };

  return (
    <Stack spacing={2} alignItems="center">
      <TabTitle title="Campaign Timeline" fragment="timeline" />
      <Stack spacing={1}>
        <Typography variant="h3" fontSize={26} pt={2} textAlign="center">
          Completed Arcs
        </Typography>
        <Divider flexItem sx={{ alignSelf: "center", width: "115%" }} />
      </Stack>
      <Stack alignItems="center">
        {arcs.length > 0 ? (
          <Stack spacing={2} width={{ xs: "100%", sm: "85%", md: "70%" }}>
            {arcs
              .slice()
              .reverse()
              .map((arc, index) => (
                <TimelineCard
                  key={index} // this is okay since the list won't change anyways
                  arc={arc}
                  handleRewind={() => openModal(index)}
                />
              ))}
          </Stack>
        ) : (
          <Paper
            sx={{
              py: 4,
              px: 4,
              borderRadius: 2,
            }}
            elevation={6}
          >
            <Stack alignItems="center" justifyContent="space-between">
              <Typography
                textAlign="center"
                variant="h3"
                fontSize={30}
                sx={{ pb: 6 }}
              >
                Your campaign has just started!
              </Typography>
              <Button sx={{ p: 2 }} onClick={goToCampaignTab}>
                Click here to progress your campaign
              </Button>
            </Stack>
          </Paper>
        )}
        T
      </Stack>
      <Modal
        open={modalOpen}
        onClose={closeModal}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Paper sx={{ p: 3, width: "50%" }}>
          <Stack spacing={2} alignItems="center">
            <Typography variant="h3" fontSize={30}>
              Confirm Rewind
            </Typography>
            <Typography textAlign="center" variant="h3" fontSize={18}>
              Are you sure you want to rewind your campaign to this point? All
              campaign data after this point will be lost.
            </Typography>
            <Stack direction="row" spacing={4} pt={3}>
              <Button sx={modalButtonSx} onClick={closeModal}>
                Cancel
              </Button>
              <Button
                sx={{ ...secondaryButtonStyles, ...modalButtonSx }}
                onClick={handleRewind}
              >
                Rewind
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Modal>
    </Stack>
  );
};

export default TimelinePage;
