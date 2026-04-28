import { HomeClient } from "@/components/HomeClient";

/**
 * Home shell is static: credits load on the client via /api/credits (server-cached)
 * so first paint is not blocked by the spreadsheet + Spotify work.
 */
export default function Home() {
  return <HomeClient />;
}
