export type SortOrder = "asc" | "desc";

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

export type WorkEntryPayload = {
  performedAt: string;
  workTypeId: number;
  volume: number;
  unit: string;
  executorName: string;
};

export type JournalFilters = {
  dateFrom: string;
  dateTo: string;
  sortOrder: SortOrder;
};

export type FieldErrors = Record<string, string>;

export type ApiValidationError = {
  errors: FieldErrors;
};
