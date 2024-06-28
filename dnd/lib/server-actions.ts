"use server";

import OpenAI from "openai";
import { Character, FirebaseCharacterType } from "./types";
import { apiPrefix } from "./utils";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

async function generateImage(prompt: string): Promise<string> {
  const imageResponse = await openai.images.generate({
    prompt,
    model: "dall-e-3",
    quality: "standard",
    response_format: "b64_json",
    size: "1024x1024",
    style: "vivid",
    n: 1,
  });

  return imageResponse.data[0].b64_json as string;
}

export async function generatePictureForCharacterOnServer(
  campaignId: string,
  characterData: Character,
  type: FirebaseCharacterType
) {
  // only include relevant character information for creating the picture
  const characterDataForPrompt: Partial<Character> = {
    name: characterData.name,
    appearance: characterData.name,
    race: characterData.race,
    class: characterData.class,
    backstory: characterData.backstory,
    equipment_array: characterData.equipment_array,
  };
  // create the prompt and generate the image
  const prompt = `Create a portrait image for a Dungeons and Dragons character with the following info. Do not include any words and text. Make the background scenic.
${JSON.stringify(characterDataForPrompt)}

It is IMPERATIVE that you DO NOT include any words or text, ONLY a portrait with a scenic background.`;
  const base64Image = await generateImage(prompt);

  await fetch(`${apiPrefix}/api/update_character_image`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      base64Image,
      campaignId,
      characterName: characterData.name,
      type,
    }),
  });
}

async function completeCharacter(prompt: string): Promise<string> {
  const response = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant that aids in character creation for Dungeons and Dragons campaigns. Users will provide you with JSON objects representing what they have and have not completed with their character. You will fill in all empty fields in the JSON and return the completed JSON format.",
      },
      { role: "user", content: prompt },
    ],
    model: "gpt-3.5-turbo-0125",
    response_format: { type: "json_object" },
  });
  return response.choices[0].message.content as string;
}

export async function generateCharacterInformation(
  characterData: Character,
  providedPrompt: string
): Promise<string> {
  const prompt =
    `The following is an incomplete Dungeons and Dragons character accompanied by a description of what a user wants their character to be like.` +
    `Fill in the empty fields based on the provided description and the already-completed fields. The following is the current state of the provided character in JSON format:\n${JSON.stringify(characterData)} \n` +
    `The following is the description for you to use to generate the rest of the character:\n${providedPrompt}`;

  return await completeCharacter(prompt);
}

export async function generatePictureForArcOnServer(summary: string) {
  // create the prompt and generate the image
  const prompt = `Create a storyboard image for a Dungeons and Dragons campaign arc using the following summary. Do not include words or text. 
${summary}`;
  const base64Image = await generateImage(prompt);

  return base64Image;
}

export async function generateMapImageOnServer(
  campaignId: string,
  userPrompt: string,
  arcIndex: number,
  mapImages?: string[]
) {
  // create the prompt and generate the image
  const prompt = `Generate a ${arcIndex == -1 ? "world" : ""} map for a Dungeons and Dragons campaign set in a mythical land. Make the map look like an old explorer map with a brownish paper color.
${userPrompt}
DO NOT include any words or text.`;
  const base64Image = await generateImage(prompt);

  await fetch(`${apiPrefix}/api/update_map_image`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      base64Image,
      campaignId,
      arcIndex,
      mapImages,
    }),
  });
}
