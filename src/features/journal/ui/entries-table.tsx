import type { WorkEntry } from "@/features/journal/model/types";

import styles from "./journal-screen.module.css";

type EntriesTableProps = {
  entries: WorkEntry[];
  loading: boolean;
  onEdit: (entry: WorkEntry) => void;
  onDelete: (entry: WorkEntry) => void;
};

export function EntriesTable({ entries, loading, onEdit, onDelete }: EntriesTableProps) {
  if (loading) {
    return <p className={styles.emptyState}>Загрузка...</p>;
  }

  if (entries.length === 0) {
    return <p className={styles.emptyState}>Записей пока нет.</p>;
  }

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Дата</th>
            <th>Вид работ</th>
            <th>Объём</th>
            <th>Исполнитель</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id}>
              <td>{entry.performedAt}</td>
              <td>{entry.workTypeName}</td>
              <td>
                {entry.volume} {entry.unit}
              </td>
              <td>{entry.executorName}</td>
              <td>
                <div className={styles.rowActions}>
                  <button
                    type="button"
                    className={styles.linkButton}
                    onClick={() => onEdit(entry)}
                  >
                    Изменить
                  </button>
                  <button
                    type="button"
                    className={styles.dangerButton}
                    onClick={() => void onDelete(entry)}
                  >
                    Удалить
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
