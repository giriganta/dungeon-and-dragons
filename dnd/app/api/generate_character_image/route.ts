import { generatePictureForCharacterOnServer } from "@/lib/server-actions";
import { Character, FirebaseCharacterType } from "@/lib/types";

export const runtime = "edge";

type RequestBody = {
  campaignId: string;
  characterData: Character;
  type: FirebaseCharacterType;
};

export async function POST(req: Request) {
  const { campaignId, characterData, type } = (await req.json()) as RequestBody;
  await generatePictureForCharacterOnServer(campaignId, characterData, type);

  return new Response(characterData.name, {
    status: 200,
  });
}
