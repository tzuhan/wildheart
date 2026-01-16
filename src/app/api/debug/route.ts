import { NextResponse } from "next/server";
import { fetchGoogleSheet, type GoogleSheetConfig } from "@/lib/googleSheets";

const SHEET_ID = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID || "";

const organizationsSheet: GoogleSheetConfig = {
  sheetId: SHEET_ID,
  sheetName: "organizations",
};

export async function GET() {
  const rows = await fetchGoogleSheet<Record<string, string>>(organizationsSheet);

  // Show first row completely to see all column names and values
  const firstRowComplete = rows[0] ? { ...rows[0] } : {};

  // Show donation-related fields for all rows
  const donationFields = rows.map((row, index) => {
    // Find any keys that might contain "donation" or "amount" (case insensitive)
    const relevantKeys: Record<string, string> = {};
    for (const key of Object.keys(row)) {
      const lowerKey = key.toLowerCase();
      if (
        lowerKey.includes("donation") ||
        lowerKey.includes("amount") ||
        lowerKey.includes("year") ||
        lowerKey.includes("report")
      ) {
        relevantKeys[key] = row[key];
      }
    }
    return {
      index,
      id: row.id,
      name: row.name_zh,
      ...relevantKeys,
    };
  });

  return NextResponse.json({
    totalRows: rows.length,
    allColumnNames: rows[0] ? Object.keys(rows[0]) : [],
    firstRowComplete,
    donationFields,
  });
}
