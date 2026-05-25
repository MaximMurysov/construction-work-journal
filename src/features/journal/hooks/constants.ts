import type { JournalFilters } from "@/features/journal/model/types";

export const DEFAULT_FILTERS: JournalFilters = {
  dateFrom: "",
  dateTo: "",
  sortOrder: "desc",
};

export const JOURNAL_ERRORS = {
  load: "Не удалось загрузить данные. Проверьте, что база данных запущена.",
  save: "Не удалось сохранить запись.",
  delete: "Не удалось удалить запись.",
} as const;
