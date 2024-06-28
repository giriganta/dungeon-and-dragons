import { getCampaignData } from "@/lib/firebase-actions";

export async function GET(
  _: Request,
  { params }: { params: { campaignId: string } }
) {
  const campaignId = params.campaignId;
  try {
    const campaign = await getCampaignData(campaignId as string);
    return new Response(JSON.stringify(campaign), { status: 200 });
  } catch (error) {
    return new Response(`Failed to fetch campaign: ${error}`, { status: 500 });
  }
}
