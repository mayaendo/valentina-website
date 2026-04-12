import { HomeClient } from "@/components/HomeClient";
import { getCarousels } from "@/lib/getCredits";

export default async function Home() {
  const carousels = await getCarousels();
  return <HomeClient carousels={carousels} />;
}
