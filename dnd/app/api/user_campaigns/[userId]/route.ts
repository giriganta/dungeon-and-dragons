import { getUserCampaigns } from "@/lib/firebase-actions";

export async function GET(
  _: Request,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId;
  try {
    const campaigns = await getUserCampaigns(userId as string);
    return new Response(JSON.stringify(campaigns), { status: 200 });
  } catch (error) {
    return new Response(`Failed to fetch user's campaigns: ${error}`, {
      status: 500,
    });
  }
}
