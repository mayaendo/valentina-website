/**
 * Parse a YouTube watch / shorts / embed / youtu.be URL and return the video id.
 */
export function parseYouTubeVideoId(raw: string): string | null {
  const s = raw?.trim();
  if (!s) return null;
  try {
    const u = new URL(s);
    const host = u.hostname.replace(/^www\./, "").toLowerCase();

    if (host === "youtu.be") {
      const id = u.pathname.split("/").filter(Boolean)[0];
      return id && /^[\w-]{6,}$/.test(id) ? id : null;
    }

    if (host !== "youtube.com" && host !== "m.youtube.com" && host !== "music.youtube.com") {
      return null;
    }

    const path = u.pathname;
    if (path === "/watch" || path.startsWith("/watch")) {
      const v = u.searchParams.get("v");
      return v && /^[\w-]{6,}$/.test(v) ? v : null;
    }
    if (path.startsWith("/embed/")) {
      const id = path.slice("/embed/".length).split("/")[0];
      return id && /^[\w-]{6,}$/.test(id) ? id : null;
    }
    if (path.startsWith("/shorts/")) {
      const id = path.slice("/shorts/".length).split("/")[0];
      return id && /^[\w-]{6,}$/.test(id) ? id : null;
    }
    if (path.startsWith("/live/")) {
      const id = path.slice("/live/".length).split("/")[0];
      return id && /^[\w-]{6,}$/.test(id) ? id : null;
    }
  } catch {
    return null;
  }
  return null;
}

/** Official CDN thumbnail; no API key. */
export function youtubeThumbnailUrl(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

/** Privacy-enhanced embed for inline playback on the site. */
export function youtubeEmbedSrc(videoId: string): string {
  const id = encodeURIComponent(videoId);
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`;
}
