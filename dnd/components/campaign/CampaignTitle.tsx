import { updateCampaignName } from "@/lib/firebase-mutate-actions";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import { User } from "firebase/auth";
import React, { useState } from "react";
import TabTitle from "../TabTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { secondaryButtonStyles } from "@/lib/theme";
import { musicFontAwesomeStyle } from "@/lib/music-styles";

type Props = {
  user: User;
  campaignId: string;
  title: string;
};

const CampaignTitle = ({ user, campaignId, title }: Props) => {
  const [editingTitle, setEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [changeTitleLoading, setChangeTitleLoading] = useState(false);

  async function handleChangeTitle() {
    setChangeTitleLoading(true);
    await updateCampaignName(user.uid, campaignId, newTitle);
    setChangeTitleLoading(false);
    setEditingTitle(false);
  }

  return (
    <Stack
      direction="row"
      justifyContent="center"
      position="relative"
      width="100%"
    >
      {editingTitle ? (
        <Stack spacing={3}>
          <Stack spacing={1}>
            <TextField
              label="Campaign Name"
              value={newTitle}
              sx={{
                input: {
                  color: "white", // Light text color for readability
                  fontSize: 40,
                  fontWeight: 100,
                },
              }}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                onClick={() => setEditingTitle(false)}
                sx={{ ...secondaryButtonStyles }}
              >
                Cancel
              </Button>
              <LoadingButton
                loading={changeTitleLoading}
                disabled={changeTitleLoading}
                onClick={handleChangeTitle}
              >
                Submit
              </LoadingButton>
            </Stack>
          </Stack>
          <Divider flexItem sx={{ width: "125%", alignSelf: "center" }} />
        </Stack>
      ) : (
        <Stack direction="row" justifyContent="space-between" width="100%">
          <IconButton
            onClick={() => setEditingTitle(true)}
            sx={{ p: 1.5, visibility: "hidden" }}
          >
            <FontAwesomeIcon
              icon={faPenToSquare}
              style={musicFontAwesomeStyle}
            />
          </IconButton>
          <Stack spacing={3}>
            <TabTitle title={title} fragment="campaign-player" />
            <Divider flexItem sx={{ width: "125%", alignSelf: "center" }} />
          </Stack>
          <Box>
            <Tooltip title="Edit Campaign">
              <IconButton onClick={() => setEditingTitle(true)} sx={{ p: 1.5 }}>
                <FontAwesomeIcon
                  icon={faPenToSquare}
                  style={musicFontAwesomeStyle}
                />
              </IconButton>
            </Tooltip>
          </Box>
        </Stack>
      )}
    </Stack>
  );
};

export default CampaignTitle;
