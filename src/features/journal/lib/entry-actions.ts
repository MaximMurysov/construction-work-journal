import { createEntry, deleteEntry, updateEntry } from "@/features/journal/lib/api";
import { formValuesToPayload } from "@/features/journal/lib/form-utils";
import type { WorkEntryFormValues } from "@/features/journal/model/types";

export async function saveWorkEntry(
  editingId: number | null,
  formValues: WorkEntryFormValues,
) {
  const payload = formValuesToPayload(formValues);

  if (editingId) {
    return updateEntry(editingId, payload);
  }

  return createEntry(payload);
}

export async function removeWorkEntry(id: number) {
  await deleteEntry(id);
}
