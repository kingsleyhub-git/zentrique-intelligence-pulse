import type { RawRow } from "./analytics";

export const MAX_FILE_MB = 25;
export const MAX_ROWS = 200_000;

export interface ParsedWorkbook {
  fileName: string;
  sheetNames: string[];
  read: (sheet: string) => { headers: string[]; rows: RawRow[] };
}

/** Reads CSV / Excel entirely in the browser — the file never leaves the device. */
export async function parseSpreadsheet(file: File): Promise<ParsedWorkbook> {
  if (file.size > MAX_FILE_MB * 1024 * 1024) {
    throw new Error(`This file is larger than ${MAX_FILE_MB} MB. Please split it or remove unused columns.`);
  }
  const XLSX = await import("xlsx");
  const isText = /\.(csv|txt|tsv)$/i.test(file.name) || file.type.startsWith("text/");
  let wb;
  try {
    // Text files are read without type guessing so day-first dates like 05/01/2026 aren't
    // silently converted as US dates; PULSE's own parser decides the date order per column.
    wb = isText
      ? XLSX.read(await file.text(), { type: "string", raw: true, dense: true })
      : XLSX.read(await file.arrayBuffer(), { type: "array", cellDates: true, dense: true });
  } catch {
    throw new Error("We couldn't read this file. Please upload a CSV, XLSX or XLS spreadsheet.");
  }
  const sheetNames = wb.SheetNames.filter((n) => wb.Sheets[n]);
  if (!sheetNames.length) throw new Error("This file doesn't contain any sheets.");
  return {
    fileName: file.name,
    sheetNames,
    read: (sheet) => {
      const ws = wb.Sheets[sheet];
      if (!ws) return { headers: [], rows: [] };
      const matrix = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1, defval: "", raw: true });
      // First row with at least two filled cells is the header row.
      const headerIdx = matrix.findIndex((r) => r.filter((c) => String(c ?? "").trim() !== "").length >= 2);
      if (headerIdx < 0) return { headers: [], rows: [] };
      const seen = new Map<string, number>();
      const headers = (matrix[headerIdx] ?? []).map((h, i) => {
        let name = String(h ?? "").trim() || `Column ${i + 1}`;
        const count = seen.get(name) ?? 0;
        seen.set(name, count + 1);
        if (count) name = `${name} (${count + 1})`;
        return name;
      });
      const body = matrix.slice(headerIdx + 1, headerIdx + 1 + MAX_ROWS);
      const rows = body.map((r) => Object.fromEntries(headers.map((h, i) => [h, r[i] ?? ""])));
      return { headers, rows };
    },
  };
}

export async function downloadWorkbook(fileName: string, sheets: { name: string; rows: Record<string, unknown>[] }[]) {
  const XLSX = await import("xlsx");
  const wb = XLSX.utils.book_new();
  for (const s of sheets) {
    const ws = XLSX.utils.json_to_sheet(s.rows.length ? s.rows : [{ Note: "No data" }]);
    XLSX.utils.book_append_sheet(wb, ws, s.name.slice(0, 31));
  }
  XLSX.writeFile(wb, fileName);
}

export async function downloadCsv(fileName: string, rows: Record<string, unknown>[]) {
  const XLSX = await import("xlsx");
  const csv = XLSX.utils.sheet_to_csv(XLSX.utils.json_to_sheet(rows));
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
