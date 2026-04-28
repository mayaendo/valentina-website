import { unstable_cache } from "next/cache";
import { getCarousels } from "@/lib/getCredits";

/**
 * Server Data Cache: sheet + Spotify resolved at most once per 5 min per deployment.
 * Used by /api/credits so the home page can load without waiting for this work.
 */
export const getCarouselsCached = unstable_cache(
  async () => getCarousels(),
  ["credits-from-sheet"],
  { revalidate: 300, tags: ["credits"] },
);
