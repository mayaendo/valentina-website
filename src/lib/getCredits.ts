/**
 * Fetches portfolio credits from a public Google Sheet (CSV export).
 *
 * Expected columns (row 1 = headers):
 *   Section | Artist | Title | Format | Role | Label | Music URL | Artwork URL
 *
 * Section values (case-insensitive):
 *   Engineer & Production | Engineer | Mix Engineer | Songwriter | Assistant Engineer
 */

import Papa from "papaparse";
import type { CarouselBlock, CreditItem } from "@/data/credits";
import type { CarouselTitleKey } from "@/lib/i18n";

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

type SheetRow = {
  Section: string;
  Artist: string;
  Title: string;
  Format: string;
  Role: string;
  Label: string;
  "Music URL": string;
  "Artwork URL": string;
};

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
  });

  if (errors.length > 0) {
    console.warn("[getCarousels] CSV parse warnings:", errors);
  }

  // Group rows by section
  const groups = new Map<CarouselTitleKey, CreditItem[]>();

  for (const row of data) {
    const sectionRaw = row.Section?.trim().toLowerCase();
    const titleKey = SECTION_MAP[sectionRaw];
    if (!titleKey) continue;

    const item: CreditItem = {
      artist: row.Artist?.trim() ?? "",
      releaseLine: buildReleaseLine(row),
      label: row.Label?.trim() || "—",
      musicUrl: row["Music URL"]?.trim() || undefined,
      artworkUrl: row["Artwork URL"]?.trim()
        ? normalizeGDriveUrl(row["Artwork URL"].trim())
        : undefined,
    };

    const existing = groups.get(titleKey) ?? [];
    existing.push(item);
    groups.set(titleKey, existing);
  }

  // Return sections in fixed order, only those with at least one item
  const result: CarouselBlock[] = [];
  for (const key of SECTION_ORDER) {
    const items = groups.get(key);
    if (items && items.length > 0) {
      result.push({ id: TITLE_KEY_TO_ID[key], titleKey: key, items });
    }
  }

  return result;
}
