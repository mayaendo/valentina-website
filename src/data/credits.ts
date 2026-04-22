import type { CarouselTitleKey } from "@/lib/i18n";

export type CreditItem = {
  artist: string;
  releaseLine: string;
  label: string;
  artworkUrl?: string;
  /** Spotify (or other) listen link from the sheet "Music URL" column when it is Spotify. */
  musicUrl?: string;
  /** YouTube URL from the sheet "Video URL" column, or a YouTube-only "Music URL". */
  videoUrl?: string;
};

export type CarouselBlock = {
  id: string;
  titleKey: CarouselTitleKey;
  items: CreditItem[];
};
