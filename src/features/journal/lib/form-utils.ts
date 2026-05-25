import type {
  WorkEntry,
  WorkEntryFormValues,
  WorkEntryPayload,
  WorkType,
} from "@/features/journal/model/types";

export function emptyFormValues(): WorkEntryFormValues {
  return {
    performedAt: new Date().toISOString().slice(0, 10),
    workTypeId: "",
    volume: "",
    unit: "",
    executorName: "",
  };
}

export function entryToFormValues(entry: WorkEntry): WorkEntryFormValues {
  return {
    performedAt: entry.performedAt,
    workTypeId: String(entry.workTypeId),
    volume: String(entry.volume),
    unit: entry.unit,
    executorName: entry.executorName,
  };
}

export function formValuesToPayload(values: WorkEntryFormValues): WorkEntryPayload {
  return {
    performedAt: values.performedAt,
    workTypeId: Number(values.workTypeId),
    volume: Number(values.volume),
    unit: values.unit.trim(),
    executorName: values.executorName.trim(),
  };
}

export function applyWorkTypeUnit(
  values: WorkEntryFormValues,
  workTypeId: string,
  workTypes: WorkType[],
): WorkEntryFormValues {
  const workType = workTypes.find((item) => item.id === Number(workTypeId));

  return {
    ...values,
    workTypeId,
    unit: workType?.defaultUnit ?? values.unit,
  };
}

export function buildDeleteConfirmMessage(entry: WorkEntry): string {
  return `Удалить запись от ${entry.performedAt} (${entry.workTypeName})?`;
}
