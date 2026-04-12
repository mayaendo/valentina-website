import Image from "next/image";
import type { CreditItem } from "@/data/credits";

type Props = {
  title: string;
  items: CreditItem[];
};

export function CreditCarousel({ title, items }: Props) {
  return (
    <div className="carousel-block">
      <div className="carousel-block__label-row">
        <span className="section-label">{title}</span>
        <span className="section-label__rule" aria-hidden="true" />
      </div>
      <div className="carousel-track" tabIndex={0}>
        {items.map((item, i) => (
          <article className="credit-card" key={`${item.artist}-${i}`}>
            {item.musicUrl ? (
              <a
                href={item.musicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="credit-card__art-link"
                aria-label={`Listen to ${item.releaseLine} by ${item.artist}`}
              >
                <CardArt artworkUrl={item.artworkUrl} artist={item.artist} />
              </a>
            ) : (
              <CardArt artworkUrl={item.artworkUrl} artist={item.artist} />
            )}
            <p className="credit-card__artist">{item.artist}</p>
            <p className="credit-card__meta">{item.releaseLine}</p>
            <p className="credit-card__label">{item.label}</p>
          </article>
        ))}
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
