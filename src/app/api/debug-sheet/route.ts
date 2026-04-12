import { NextResponse } from "next/server";
import Papa from "papaparse";

export async function GET() {
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!sheetId) {
    return NextResponse.json({ error: "GOOGLE_SHEET_ID not set" }, { status: 500 });
  }

  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;

  let csvText: string;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      return NextResponse.json({
        error: `Fetch failed: ${res.status} ${res.statusText}`,
        url,
      }, { status: 500 });
    }
    csvText = await res.text();
  } catch (err) {
    return NextResponse.json({ error: String(err), url }, { status: 500 });
  }

  const { data, errors } = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  return NextResponse.json({
    url,
    rawCsvPreview: csvText.slice(0, 500),
    parsedRows: data,
    parseErrors: errors,
  });
}
