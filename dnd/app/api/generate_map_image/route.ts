import { generateMapImageOnServer } from "@/lib/server-actions";

export const runtime = "edge";

type RequestBody = {
  campaignId: string;
  prompt: string;
  arcIndex: number;
  mapImagesInArc?: string[];
};

export async function POST(req: Request) {
  const { campaignId, prompt, arcIndex, mapImagesInArc } =
    (await req.json()) as RequestBody;
  await generateMapImageOnServer(campaignId, prompt, arcIndex, mapImagesInArc);

  return new Response("Success", {
    status: 200,
  });
}
