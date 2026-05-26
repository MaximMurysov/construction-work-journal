import buttonStyles from "./shared/buttons.module.css";
import styles from "./entry-form-submit.module.css";

type EntryFormSubmitProps = {
  editingId: number | null;
  submitting: boolean;
};

export function EntryFormSubmit({ editingId, submitting }: EntryFormSubmitProps) {
  const label = submitting
    ? "Сохранение..."
    : editingId
      ? "Сохранить изменения"
      : "Добавить запись";

  return (
    <div className={styles.formActions}>
      <button type="submit" className={buttonStyles.primaryButton} disabled={submitting}>
        {label}
      </button>
    </div>
  );
}
