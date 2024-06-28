import { generatePictureForArcOnServer } from "@/lib/server-actions";
import { apiPrefix } from "@/lib/utils";
import OpenAI from "openai";

export const runtime = "edge";

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

type RequestBody = {
  campaignId: string;
  arcIndex: number;
  // events: string[];
  // characters: string[];
  // npcs: string[];
  prompt: string;
};

export async function POST(req: Request) {
  const { campaignId, arcIndex, prompt } = (await req.json()) as RequestBody;

  // const prompt = getPrompt(events);

  // const characters = extractCharacters(events, characters);

  const messages = [
    { role: "user", content: prompt },
  ] as OpenAI.Chat.Completions.ChatCompletionMessageParam[];

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages,
  });

  const { title, summary } = parseGPTReponse(
    response.choices[0].message.content as string
  );

  const base64Image = await generatePictureForArcOnServer(summary);

  await fetch(`${apiPrefix}/api/update_campaign_arc`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      base64Image,
      campaignId,
      arcIndex,
      title,
      summary,
    }),
  });

  return new Response(title, {
    status: 200,
  });
}

// function getPrompt(events: string[]): string {
// }

function parseGPTReponse(response: string) {
  const extractText = (label: string, nextLabel: string) => {
    const startIndex = response.indexOf(label) + label.length;
    const endIndex = nextLabel
      ? response.indexOf(nextLabel, startIndex)
      : response.length;
    return response
      .substring(startIndex, endIndex !== -1 ? endIndex : undefined)
      .trim();
  };
  const firstLabel = "Title: ";
  const secondLabel = "\n\nSummary: ";

  const title = extractText(firstLabel, secondLabel);
  const summary = extractText(secondLabel, "");

  return { title, summary };
}
