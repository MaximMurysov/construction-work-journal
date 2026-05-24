export type WorkType = {
  id: number;
  name: string;
  defaultUnit: string;
};

export type WorkEntry = {
  id: number;
  performedAt: string;
  workTypeId: number;
  workTypeName: string;
  volume: number;
  unit: string;
  executorName: string;
};

export type WorkEntryFormValues = {
  performedAt: string;
  workTypeId: string;
  volume: string;
  unit: string;
  executorName: string;
};

export const emptyFormValues = (): WorkEntryFormValues => ({
  performedAt: new Date().toISOString().slice(0, 10),
  workTypeId: "",
  volume: "",
  unit: "",
  executorName: "",
});

export function entryToFormValues(entry: WorkEntry): WorkEntryFormValues {
  return {
    performedAt: entry.performedAt,
    workTypeId: String(entry.workTypeId),
    volume: String(entry.volume),
    unit: entry.unit,
    executorName: entry.executorName,
  };
}

export function formValuesToPayload(values: WorkEntryFormValues) {
  return {
    performedAt: values.performedAt,
    workTypeId: Number(values.workTypeId),
    volume: Number(values.volume),
    unit: values.unit.trim(),
    executorName: values.executorName.trim(),
  };
}
