export interface Report {
  id: string;
  listingId: string;
  variety: string;
  farmer: string;
  reason: string;
  note: string;
  reporter: string;
  createdAt: string;
}

export const REPORTS_KEY = "agrilink-reports";
export const MY_REPORTS_KEY = "agrilink-my-reports";
export const REPORTS_EVENT = "agrilink-reports-change";

/** i18n keys — rendered through t() wherever shown. */
export const REPORT_REASONS = [
  "Wrong price",
  "Poor quality",
  "Sold out",
  "Spam or fraud",
  "Other",
];

const isBrowser = () => typeof window !== "undefined";

function readJSON<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage errors (private mode etc.)
  }
}

export function notifyReportsChanged() {
  if (isBrowser()) window.dispatchEvent(new Event(REPORTS_EVENT));
}

function currentReporter(): string {
  if (!isBrowser()) return "Guest";
  try {
    return window.localStorage.getItem("agrilink-demo-user") ?? "Guest";
  } catch {
    return "Guest";
  }
}

export function getReports(): Report[] {
  const items = readJSON<Report[]>(REPORTS_KEY, []);
  return Array.isArray(items) ? items : [];
}

/** Listing ids this browser has already reported (drives the Reported state). */
export function getMyReportedIds(): string[] {
  const ids = readJSON<string[]>(MY_REPORTS_KEY, []);
  return Array.isArray(ids) ? ids : [];
}

export function hasReported(listingId: string): boolean {
  return getMyReportedIds().includes(listingId);
}

export function getReportCount(listingId: string): number {
  return getReports().filter((r) => r.listingId === listingId).length;
}

/** listingId -> report count, for the admin moderation view. */
export function getReportCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const r of getReports()) {
    counts[r.listingId] = (counts[r.listingId] ?? 0) + 1;
  }
  return counts;
}

export function submitReport(input: {
  listingId: string;
  variety: string;
  farmer: string;
  reason: string;
  note: string;
}): Report {
  const report: Report = {
    id: `rep-${Date.now().toString(36)}`,
    listingId: input.listingId,
    variety: input.variety,
    farmer: input.farmer,
    reason: input.reason,
    note: input.note.trim(),
    reporter: currentReporter(),
    createdAt: new Date().toISOString(),
  };
  writeJSON(REPORTS_KEY, [...getReports(), report]);
  const mine = getMyReportedIds();
  if (!mine.includes(input.listingId)) {
    writeJSON(MY_REPORTS_KEY, [...mine, input.listingId]);
  }
  notifyReportsChanged();
  return report;
}
