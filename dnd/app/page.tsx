import LearnMoreButton from "@/components/LearnMoreButton";
import Title from "@/components/Title";
import CampaignSection from "@/components/home/CampaignSection";
import { Stack } from "@mui/material";

export default function Home() {
  return (
    <Stack alignItems="center" spacing={6} position="relative">
      {/* Title Section */}
      <Stack spacing={2} alignItems="center">
        <Title>Welcome to the DnD AI Generator</Title>
        <div>
          <LearnMoreButton />
        </div>
      </Stack>
      {/* Campaign Section  */}
      <CampaignSection />
    </Stack>
  );
}
