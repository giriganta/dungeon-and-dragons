import { User } from "firebase/auth";
import useSWR from "swr";
import Loading from "../Loading";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { UserCampaignData } from "@/lib/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import theme from "@/lib/theme";
import StyleScroll from "@/components/StyleScroll";
import { createCampaign } from "@/lib/firebase-actions";
import { deleteCampaign } from "@/lib/firebase-mutate-actions";
import { useState } from "react";
import { secondaryButtonStyles } from "@/lib/theme";
import fetcher from "@/lib/fetcher";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteModal from "../DeleteModal";

type Props = {
  user: User;
};

function CampaignViewer({ user }: Props) {
  const [creatingNewCampaign, setCreatingNewCampaign] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<UserCampaignData>();
  const [deleteIsLoading, setDeleteIsLoading] = useState(false);
  const { data, isLoading, error } = useSWR(
    `/api/user_campaigns/${user.uid}`,
    fetcher
  );
  const campaigns = data as UserCampaignData[];
  const router = useRouter();
  const buttonSx = {
    ...secondaryButtonStyles,
    py: 1.5,
    px: 2.5,
    width: "100%",
  };

  function closeModal() {
    setModalOpen(false);
    setCampaignToDelete(undefined);
  }

  function openModal(userCampaign: UserCampaignData) {
    setModalOpen(true);
    setCampaignToDelete(userCampaign);
  }

  async function createNewCampaign() {
    // create campaign
    setCreatingNewCampaign(true);
    const newCampaignId = await createCampaign(user.uid);
    router.push(`/campaigns/${newCampaignId}`);
  }

  async function handleDeleteCampaign() {
    setDeleteIsLoading(true);
    await deleteCampaign(campaignToDelete?.id as string, user.uid);
    setDeleteIsLoading(false);
    closeModal();
  }

  if (error) {
    return <Typography color="error">Error</Typography>;
  }

  const hasCampaigns = campaigns && campaigns.length > 0;

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Stack
        py={3}
        px={hasCampaigns ? 0 : 4}
        bgcolor={theme.palette.primary.main}
        borderRadius={5}
        width={hasCampaigns ? { md: "65%", sm: "75%", xs: "90%" } : "auto"}
        spacing={3}
      >
        <Typography variant="h2" textAlign="center" fontSize={40}>
          Campaigns
        </Typography>
        <Divider flexItem sx={{ width: "90%", alignSelf: "center" }} />
        <Stack
          direction={{ xs: "column-reverse", md: "row" }}
          justifyContent="space-evenly"
          spacing={2}
          pt={2}
        >
          {/* Existing campaign list */}
          {hasCampaigns && (
            <StyleScroll
              spacing={2}
              sx={{
                width: { md: "50%", xs: "100%" },
                overflowY: "auto",
                overflowX: "hidden",
                alignItems: "center",
                maxHeight: "70vh",
                px: { sm: 8, xs: 6 },
              }}
            >
              <Typography fontSize={20} textAlign="center" gutterBottom>
                Resume a Campaign
              </Typography>

              <Stack spacing={2}>
                {campaigns.map((campaign) => (
                  <Box key={campaign.id} width="100%" position="relative">
                    <Link
                      href={`/campaigns/${campaign.id}`}
                      style={{ width: "100%" }}
                    >
                      <Button sx={buttonSx}>{campaign.name}</Button>
                    </Link>
                    <Tooltip title="Delete Campaign">
                      <IconButton
                        sx={{
                          position: "absolute",
                          right: { sm: -50, xs: -45 },
                          top: "50%",
                          transform: "translateY(-50%);",
                        }}
                        onClick={() => openModal(campaign)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                ))}
              </Stack>
            </StyleScroll>
          )}
          {hasCampaigns && <Divider flexItem orientation="vertical" />}
          {/* New campaign */}
          <Stack
            justifyContent={hasCampaigns ? "flex-start" : "center"}
            spacing={2}
            width={hasCampaigns ? { md: "50%", xs: "100%" } : "100%"}
            alignItems="center"
            px={{ sm: 8, xs: 4 }}
          >
            {hasCampaigns && (
              <Typography fontSize={20} textAlign="center" gutterBottom>
                Start from Scratch
              </Typography>
            )}
            <Box>
              <LoadingButton
                loading={creatingNewCampaign}
                disabled={creatingNewCampaign}
                sx={buttonSx}
                onClick={createNewCampaign}
              >
                Create new campaign
              </LoadingButton>
            </Box>
          </Stack>
        </Stack>
      </Stack>
      <DeleteModal
        open={modalOpen}
        onClose={closeModal}
        title="Confirm Delete Campaign"
        description={`Are you sure you want to delete ${campaignToDelete?.name}? All data for this campaign will be lost.`}
        loading={deleteIsLoading}
        onSubmit={handleDeleteCampaign}
      />
    </>
  );
}

export default CampaignViewer;
