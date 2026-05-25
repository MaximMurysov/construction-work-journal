import styles from "./journal-screen.module.css";

type EntryFormHeaderProps = {
  editingId: number | null;
  onCancel: () => void;
};

export function EntryFormHeader({ editingId, onCancel }: EntryFormHeaderProps) {
  return (
    <div className={styles.panelHeader}>
      <h2>{editingId ? "Редактирование записи" : "Новая запись"}</h2>
      {editingId ? (
        <button type="button" className={styles.secondaryButton} onClick={onCancel}>
          Отменить
        </button>
      ) : null}
    </div>
  );
}
