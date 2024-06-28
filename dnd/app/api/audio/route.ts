import { getAudio } from "@/lib/firebase-actions";
import { AudioType } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const musicLink = await getAudio(
      params.get("type") as AudioType,
      params.get("variant") as string
    );
    return new Response(JSON.stringify(musicLink), { status: 200 });
  } catch (error) {
    return new Response(`Failed to fetch campaign: ${error}`, { status: 500 });
  }
}
