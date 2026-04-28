import { NextResponse } from "next/server";
import { getCarouselsCached } from "@/lib/getCarouselsCached";

/**
 * JSON credits for the client. Heavy work (Sheet + Spotify) is cached on the server
 * via getCarouselsCached; repeat calls within revalidate window are fast.
 */
export async function GET() {
  try {
    const data = await getCarouselsCached();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "private, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (err) {
    console.error("[api/credits]", err);
    return NextResponse.json(
      { error: "credits_unavailable" },
      { status: 502 },
    );
  }
}
