import { readJson } from "@/features/journal/lib/http";
import type {
  JournalFilters,
  WorkEntry,
  WorkEntryPayload,
  WorkType,
} from "@/features/journal/model/types";

export async function fetchWorkTypes(): Promise<WorkType[]> {
  return readJson<WorkType[]>(await fetch("/api/work-types"));
}

export async function fetchEntries(filters: JournalFilters): Promise<WorkEntry[]> {
  const params = new URLSearchParams();
  if (filters.dateFrom) params.set("from", filters.dateFrom);
  if (filters.dateTo) params.set("to", filters.dateTo);
  params.set("sort", filters.sortOrder);

  return readJson<WorkEntry[]>(await fetch(`/api/entries?${params.toString()}`));
}

export async function createEntry(payload: WorkEntryPayload): Promise<WorkEntry> {
  return readJson<WorkEntry>(
    await fetch("/api/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  );
}

export async function updateEntry(
  id: number,
  payload: WorkEntryPayload,
): Promise<WorkEntry> {
  return readJson<WorkEntry>(
    await fetch(`/api/entries/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),
  );
}

export async function deleteEntry(id: number): Promise<void> {
  await readJson<{ ok: boolean }>(
    await fetch(`/api/entries/${id}`, { method: "DELETE" }),
  );
}
