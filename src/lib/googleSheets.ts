/**
 * Utility for fetching data from public Google Sheets via CSV export
 *
 * To use:
 * 1. Create a Google Sheet
 * 2. Share it: File > Share > Publish to web > Select sheet > CSV format
 * 3. Or: Share > Anyone with link can view (then use the sheet ID)
 *
 * CSV URL format:
 * https://docs.google.com/spreadsheets/d/{SHEET_ID}/gviz/tq?tqx=out:csv&sheet={SHEET_NAME}
 */

export interface GoogleSheetConfig {
  sheetId: string;
  sheetName: string;
}

/**
 * Build the CSV export URL for a Google Sheet
 */
export function buildGoogleSheetCsvUrl(config: GoogleSheetConfig): string {
  const { sheetId, sheetName } = config;
  return `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
}

/**
 * Parse CSV string into array of objects
 * Assumes first row is headers
 * Handles multi-line values within quoted cells
 */
export function parseCsv<T extends Record<string, string>>(csv: string): T[] {
  // Parse all rows handling multi-line quoted values
  const allRows = parseCsvWithMultiline(csv);
  if (allRows.length < 2) return [];

  const headers = allRows[0];
  const rows: T[] = [];

  for (let i = 1; i < allRows.length; i++) {
    const values = allRows[i];
    const row = {} as T;

    headers.forEach((header, index) => {
      // Clean header name (remove quotes, trim)
      const cleanHeader = header.replace(/^"|"$/g, "").trim();
      const value = values[index]?.replace(/^"|"$/g, "").trim() || "";
      (row as Record<string, string>)[cleanHeader] = value;
    });

    rows.push(row);
  }

  return rows;
}

/**
 * Parse CSV handling multi-line values within quoted cells
 * Google Sheets exports cells with newlines wrapped in double quotes
 * and uses "" to escape quotes within quoted cells
 */
function parseCsvWithMultiline(csv: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentValue = "";
  let inQuotes = false;
  let i = 0;

  while (i < csv.length) {
    const char = csv[i];
    const nextChar = csv[i + 1];

    if (char === '"') {
      if (!inQuotes) {
        // Starting a quoted value
        inQuotes = true;
      } else if (nextChar === '"') {
        // Escaped quote ("" -> ")
        currentValue += '"';
        i++; // Skip the next quote
      } else {
        // Ending a quoted value
        inQuotes = false;
      }
    } else if (char === "," && !inQuotes) {
      // Field separator
      currentRow.push(currentValue);
      currentValue = "";
    } else if (char === "\r" && nextChar === "\n" && !inQuotes) {
      // Windows line ending outside quotes - end of row
      currentRow.push(currentValue);
      if (currentRow.length > 0) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentValue = "";
      i++; // Skip the \n
    } else if (char === "\n" && !inQuotes) {
      // Unix line ending outside quotes - end of row
      currentRow.push(currentValue);
      if (currentRow.length > 0) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentValue = "";
    } else if (char === "\r" && !inQuotes) {
      // Old Mac line ending outside quotes - end of row
      currentRow.push(currentValue);
      if (currentRow.length > 0) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentValue = "";
    } else {
      // Regular character (including newlines inside quotes)
      currentValue += char;
    }
    i++;
  }

  // Don't forget the last value/row
  if (currentValue || currentRow.length > 0) {
    currentRow.push(currentValue);
    if (currentRow.length > 0) {
      rows.push(currentRow);
    }
  }

  return rows;
}

/**
 * Parse a single CSV line, handling quoted values with commas
 */
function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

/**
 * Fetch and parse a Google Sheet as CSV
 */
export async function fetchGoogleSheet<T extends Record<string, string>>(
  config: GoogleSheetConfig
): Promise<T[]> {
  const url = buildGoogleSheetCsvUrl(config);

  const isDev = process.env.NODE_ENV === "development";

  const response = await fetch(url, {
    // In development: always fetch fresh data
    // In production: cache for 5 minutes
    ...(isDev ? { cache: "no-store" as const } : { next: { revalidate: 300 } }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Google Sheet: ${response.statusText}`);
  }

  const csv = await response.text();
  return parseCsv<T>(csv);
}

/**
 * Helper to convert string to number, returns undefined if invalid
 * Handles comma-formatted numbers like "2,078,999"
 */
export function parseNumber(value: string | undefined): number | undefined {
  if (!value) return undefined;
  // Remove commas from formatted numbers
  const cleanValue = value.replace(/,/g, "");
  const num = Number(cleanValue);
  return isNaN(num) ? undefined : num;
}

/**
 * Helper to convert string to boolean
 */
export function parseBoolean(value: string | undefined): boolean {
  if (!value) return false;
  return value.toLowerCase() === "true" || value === "1";
}
