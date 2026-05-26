import type { JournalFilters, SortOrder } from "@/features/journal/model/types";

import buttonStyles from "./shared/buttons.module.css";
import styles from "./entries-filters.module.css";

type EntriesFiltersProps = {
  filters: JournalFilters;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onSortOrderChange: (value: SortOrder) => void;
  onReset: () => void;
};

export function EntriesFilters({
  filters,
  onDateFromChange,
  onDateToChange,
  onSortOrderChange,
  onReset,
}: EntriesFiltersProps) {
  return (
    <div className={styles.filters}>
      <label className={styles.filterField}>
        <span>С даты</span>
        <input
          type="date"
          value={filters.dateFrom}
          onChange={(event) => onDateFromChange(event.target.value)}
        />
      </label>

      <label className={styles.filterField}>
        <span>По дату</span>
        <input
          type="date"
          value={filters.dateTo}
          onChange={(event) => onDateToChange(event.target.value)}
        />
      </label>

      <label className={styles.filterField}>
        <span>Сортировка</span>
        <select
          value={filters.sortOrder}
          onChange={(event) => onSortOrderChange(event.target.value as SortOrder)}
        >
          <option value="desc">Сначала новые</option>
          <option value="asc">Сначала старые</option>
        </select>
      </label>

      <button type="button" className={buttonStyles.secondaryButton} onClick={onReset}>
        Сбросить фильтры
      </button>
    </div>
  );
}
