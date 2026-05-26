import type { JournalFilters, SortOrder, WorkEntry } from "@/features/journal/model/types";

import { EntriesFilters } from "./entries-filters";
import { EntriesTable } from "./entries-table";
import buttonStyles from "./shared/buttons.module.css";
import panelStyles from "./shared/panel.module.css";

type EntriesPanelProps = {
  entries: WorkEntry[];
  filters: JournalFilters;
  loading: boolean;
  onRefresh: () => void;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onSortOrderChange: (value: SortOrder) => void;
  onResetFilters: () => void;
  onEdit: (entry: WorkEntry) => void;
  onDelete: (entry: WorkEntry) => void;
};

export function EntriesPanel({
  entries,
  filters,
  loading,
  onRefresh,
  onDateFromChange,
  onDateToChange,
  onSortOrderChange,
  onResetFilters,
  onEdit,
  onDelete,
}: EntriesPanelProps) {
  return (
    <section className={panelStyles.panel}>
      <div className={panelStyles.panelHeader}>
        <h2>Записи журнала</h2>
        <button type="button" className={buttonStyles.secondaryButton} onClick={() => void onRefresh()}>
          Обновить
        </button>
      </div>

      <EntriesFilters
        filters={filters}
        onDateFromChange={onDateFromChange}
        onDateToChange={onDateToChange}
        onSortOrderChange={onSortOrderChange}
        onReset={onResetFilters}
      />

      <EntriesTable
        entries={entries}
        loading={loading}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </section>
  );
}
