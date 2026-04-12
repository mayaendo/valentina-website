import type { CarouselTitleKey } from "@/lib/i18n";

export type CreditItem = {
  artist: string;
  releaseLine: string;
  label: string;
  artworkUrl?: string;
  musicUrl?: string;
};

export type CarouselBlock = {
  id: string;
  titleKey: CarouselTitleKey;
  items: CreditItem[];
};
