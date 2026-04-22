import Image from "next/image";
import type { CreditItem } from "@/data/credits";
import {
  parseYouTubeVideoId,
  youtubeEmbedSrc,
} from "@/lib/youtube";

type Props = {
  title: string;
  items: CreditItem[];
  watchYoutubeLabel: string;
};

export function CreditCarousel({ title, items, watchYoutubeLabel }: Props) {
  return (
    <div className="carousel-block">
      <div className="carousel-block__label-row">
        <span className="section-label">{title}</span>
        <span className="section-label__rule" aria-hidden="true" />
      </div>
      <div className="carousel-track" tabIndex={0}>
        {items.map((item, i) => {
          const ytId = item.videoUrl
            ? parseYouTubeVideoId(item.videoUrl)
            : null;
          const youtubeOnly = Boolean(ytId) && !item.musicUrl;

          if (youtubeOnly && ytId) {
            return (
              <article
                className="credit-card credit-card--youtube"
                key={`yt-${item.artist}-${item.releaseLine}-${ytId}-${i}`}
              >
                <div className="credit-card__embed">
                  <iframe
                    src={youtubeEmbedSrc(ytId)}
                    title={`YouTube — ${item.artist}: ${item.releaseLine}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                    className="credit-card__iframe"
                  />
                </div>
                <p className="credit-card__artist">{item.artist}</p>
                <p className="credit-card__meta">{item.releaseLine}</p>
                <p className="credit-card__label">{item.label}</p>
              </article>
            );
          }

          const artHref = item.musicUrl ?? item.videoUrl;
          const showYoutubeExtra =
            Boolean(item.musicUrl) &&
            Boolean(item.videoUrl) &&
            item.musicUrl !== item.videoUrl;

          return (
            <article className="credit-card" key={`${item.artist}-${i}`}>
              {artHref ? (
                <a
                  href={artHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="credit-card__art-link"
                  aria-label={`${item.artist} — ${item.releaseLine}`}
                >
                  <CardArt artworkUrl={item.artworkUrl} artist={item.artist} />
                </a>
              ) : (
                <CardArt artworkUrl={item.artworkUrl} artist={item.artist} />
              )}
              <p className="credit-card__artist">{item.artist}</p>
              <p className="credit-card__meta">{item.releaseLine}</p>
              <p className="credit-card__label">{item.label}</p>
              {showYoutubeExtra && item.videoUrl ? (
                <a
                  href={item.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="credit-card__video-link"
                >
                  {watchYoutubeLabel}
                </a>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}

function CardArt({
  artworkUrl,
  artist,
}: {
  artworkUrl?: string;
  artist: string;
}) {
  if (artworkUrl) {
    return (
      <div className="credit-card__art credit-card__art--img">
        <Image
          src={artworkUrl}
          alt={`Artwork for ${artist}`}
          fill
          sizes="260px"
          className="credit-card__img"
          unoptimized
        />
      </div>
    );
  }
  return <div className="credit-card__art" />;
}
