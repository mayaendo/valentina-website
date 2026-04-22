/**
 * Fetches portfolio credits from a public Google Sheet (CSV export).
 *
 * Expected columns (row 1 = headers):
 *   Section | Artist | Title | Format | Role | Label | Music URL | Video URL | Artwork URL
 *
 * "Video URL" is optional. Use it for YouTube (watch, youtu.be, Shorts, embed). It may
 * sit several columns away from "Music URL"; blank column headers are handled safely.
 *
 * Section values (case-insensitive):
 *   Engineer & Production | Engineer | Mix Engineer | Songwriter | Assistant Engineer
 *
 * Artwork resolution: (1) Artwork URL, (2) Spotify album art from Music URL if Spotify,
 * (3) YouTube thumbnail from Video URL or from Music URL if that cell is YouTube-only.
 * Spotify API requires SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env.local.
 */

import Papa from "papaparse";
import type { CarouselBlock, CreditItem } from "@/data/credits";
import type { CarouselTitleKey } from "@/lib/i18n";
import {
  parseYouTubeVideoId,
  youtubeThumbnailUrl,
} from "@/lib/youtube";

// ——— Spotify helpers ———

let spotifyTokenCache: { token: string; expiresAt: number } | null = null;

/** One Spotify Web API request at a time to avoid 429 from parallel track fetches. */
let spotifyArtworkQueue: Promise<unknown> = Promise.resolve();

function enqueueSpotifyArtworkTask<T>(task: () => Promise<T>): Promise<T> {
  const spacing = () =>
    new Promise<void>((r) => setTimeout(r, 80));
  const run = spotifyArtworkQueue.then(() => task());
  spotifyArtworkQueue = run.then(spacing, spacing);
  return run;
}

async function getSpotifyToken(): Promise<string | null> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;

  const now = Date.now();
  if (spotifyTokenCache && spotifyTokenCache.expiresAt > now + 5000) {
    return spotifyTokenCache.token;
  }

  try {
    const res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      },
      body: "grant_type=client_credentials",
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Spotify token fetch failed: ${res.status}`);
    const json = await res.json() as { access_token: string; expires_in: number };
    spotifyTokenCache = {
      token: json.access_token,
      expiresAt: now + json.expires_in * 1000,
    };
    return spotifyTokenCache.token;
  } catch (err) {
    console.error("[Spotify] Could not get access token.", err);
    return null;
  }
}

/**
 * Parses a Spotify URL and returns { type, id } where type is
 * "track" | "album" | "episode" | etc., or null if not a Spotify URL.
 */
function parseSpotifyUrl(url: string): { type: string; id: string } | null {
  try {
    const u = new URL(url);
    if (!u.hostname.includes("spotify.com")) return null;
    // Strip locale segments like "intl-es", "intl-pt", etc.
    const parts = u.pathname.split("/").filter((p) => p && !p.startsWith("intl-"));
    // parts is e.g. ["track", "4cOdK2wGLETKBW3PvgPWqT"] or ["album", "xxx"]
    if (parts.length >= 2) return { type: parts[0], id: parts[1] };
  } catch {
    // not a valid URL
  }
  return null;
}

async function getSpotifyArtwork(musicUrl: string): Promise<string | undefined> {
  const parsed = parseSpotifyUrl(musicUrl);
  if (!parsed) return undefined;

  return enqueueSpotifyArtworkTask(async () => {
    const token = await getSpotifyToken();
    if (!token) return undefined;

    // Tracks → use album images. Albums/singles/EPs → use album images directly.
    const endpoint =
      parsed.type === "track"
        ? `https://api.spotify.com/v1/tracks/${parsed.id}`
        : `https://api.spotify.com/v1/${parsed.type}s/${parsed.id}`;

    const maxAttempts = 4;
    let res: Response | undefined;

    try {
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        res = await fetch(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
          next: { revalidate: 86400 }, // cache artwork for 24 h
        });
        if (res.ok) break;
        if (res.status === 429 && attempt < maxAttempts - 1) {
          const retryAfter = res.headers.get("Retry-After");
          const sec = retryAfter ? Number.parseFloat(retryAfter) : Number.NaN;
          const waitMs = Number.isFinite(sec)
            ? Math.min(60_000, Math.max(500, sec * 1000))
            : 1000 * (attempt + 1);
          await new Promise((r) => setTimeout(r, waitMs));
          continue;
        }
        // 404 / other errors: skip quietly (no throw → no Next.js console error overlay)
        return undefined;
      }

      if (!res?.ok) return undefined;

      const json = (await res.json()) as {
        images?: { url: string }[];
        album?: { images?: { url: string }[] };
      };
      const images = json.images ?? json.album?.images ?? [];
      return (images[0] as { url: string } | undefined)?.url;
    } catch {
      return undefined;
    }
  });
}

const SECTION_MAP: Record<string, CarouselTitleKey> = {
  "engineer & production": "engProd",
  engineer: "eng",
  "mix engineer": "mix",
  songwriter: "sw",
  "assistant engineer": "ae",
};

const SECTION_ORDER: CarouselTitleKey[] = [
  "engProd",
  "eng",
  "mix",
  "sw",
  "ae",
];

const TITLE_KEY_TO_ID: Record<CarouselTitleKey, string> = {
  engProd: "eng-prod",
  eng: "eng",
  mix: "mix",
  sw: "sw",
  ae: "ae",
};

/** Spotify / other audio cards first; YouTube-only rows (video, no music URL) last. */
function isYoutubeOnlyCredit(item: CreditItem): boolean {
  const v = item.videoUrl;
  return Boolean(v && parseYouTubeVideoId(v) && !item.musicUrl);
}

function sortCreditsForDisplay(items: CreditItem[]): CreditItem[] {
  return [...items].sort(
    (a, b) => Number(isYoutubeOnlyCredit(a)) - Number(isYoutubeOnlyCredit(b)),
  );
}

type SheetRow = {
  Section: string;
  Artist: string;
  Title: string;
  Format: string;
  Role: string;
  Label: string;
  "Music URL": string;
  /** Optional column — omit in old sheets until you add the header. */
  "Video URL"?: string;
  "Artwork URL": string;
};

function isSpotifyUrl(url: string): boolean {
  try {
    return new URL(url).hostname.includes("spotify.com");
  } catch {
    return false;
  }
}

function buildReleaseLine(row: SheetRow): string {
  const fmt = row.Format?.trim();
  const title = row.Title?.trim();
  const role = row.Role?.trim();
  const prefix = fmt && fmt !== "—" && fmt !== "" ? `${fmt} ` : "";
  const suffix = role && role !== "—" ? ` (${role})` : "";
  return `${prefix}\u201c${title}\u201d${suffix}`;
}

function normalizeGDriveUrl(raw: string): string {
  // Convert Google Drive share URL to a thumbnail URL (works with public files)
  // https://drive.google.com/file/d/{ID}/view → https://drive.google.com/thumbnail?id={ID}&sz=w600
  const match = raw.match(/\/file\/d\/([^/?]+)/);
  if (match) {
    return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w600`;
  }
  return raw;
}

export async function getCarousels(): Promise<CarouselBlock[]> {
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!sheetId) {
    console.warn("[getCarousels] GOOGLE_SHEET_ID not set — carousels will be empty.");
    return [];
  }

  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;

  // In development: always fetch fresh. In production: cache for 5 minutes.
  const fetchOptions =
    process.env.NODE_ENV === "development"
      ? { cache: "no-store" as const }
      : { next: { revalidate: 300 } };

  let csvText: string;
  try {
    const res = await fetch(url, fetchOptions);
    if (!res.ok) throw new Error(`Sheet fetch failed: ${res.status}`);
    csvText = await res.text();
  } catch (err) {
    console.error("[getCarousels] Could not fetch sheet.", err);
    return [];
  }

  const { data, errors } = Papa.parse<SheetRow>(csvText, {
    header: true,
    skipEmptyLines: true,
    // Blank header cells (e.g. empty cols between "Music URL" and "Video URL") become
    // duplicate "" keys and break column alignment — give each column a unique name.
    transformHeader(header, index) {
      const h = header.trim();
      return h || `__blank_${index}`;
    },
  });

  if (errors.length > 0) {
    console.warn("[getCarousels] CSV parse warnings:", errors);
  }

  // Resolve artwork for all rows in parallel
  const resolvedItems = await Promise.all(
    data.map(async (row) => {
      const sectionRaw = row.Section?.trim().toLowerCase();
      const titleKey = SECTION_MAP[sectionRaw];
      if (!titleKey) return null;

      const manualArtwork = row["Artwork URL"]?.trim();
      const musicRaw = row["Music URL"]?.trim() || "";
      const videoRaw = row["Video URL"]?.trim() || "";

      let musicUrl: string | undefined;
      let videoUrl: string | undefined;
      if (musicRaw && isSpotifyUrl(musicRaw)) {
        musicUrl = musicRaw;
      } else if (musicRaw && parseYouTubeVideoId(musicRaw)) {
        videoUrl = musicRaw;
      } else if (musicRaw) {
        musicUrl = musicRaw;
      }
      if (videoRaw && parseYouTubeVideoId(videoRaw)) {
        videoUrl = videoRaw;
      }

      let artworkUrl: string | undefined;
      if (manualArtwork) {
        artworkUrl = normalizeGDriveUrl(manualArtwork);
      } else if (musicUrl) {
        artworkUrl = await getSpotifyArtwork(musicUrl);
      }
      if (!artworkUrl) {
        const ytId =
          parseYouTubeVideoId(videoUrl ?? "") ||
          parseYouTubeVideoId(musicRaw);
        if (ytId) {
          artworkUrl = youtubeThumbnailUrl(ytId);
        }
      }

      const item: CreditItem = {
        artist: row.Artist?.trim() ?? "",
        releaseLine: buildReleaseLine(row),
        label: row.Label?.trim() || "—",
        musicUrl,
        videoUrl,
        artworkUrl,
      };

      return { titleKey, item };
    })
  );

  // Group rows by section
  const groups = new Map<CarouselTitleKey, CreditItem[]>();

  for (const resolved of resolvedItems) {
    if (!resolved) continue;
    const { titleKey, item } = resolved;
    const existing = groups.get(titleKey) ?? [];
    existing.push(item);
    groups.set(titleKey, existing);
  }

  // Return sections in fixed order, only those with at least one item
  const result: CarouselBlock[] = [];
  for (const key of SECTION_ORDER) {
    const items = groups.get(key);
    if (items && items.length > 0) {
      result.push({
        id: TITLE_KEY_TO_ID[key],
        titleKey: key,
        items: sortCreditsForDisplay(items),
      });
    }
  }

  return result;
}
