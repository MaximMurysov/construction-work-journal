import buttonStyles from "./shared/buttons.module.css";
import panelStyles from "./shared/panel.module.css";

type EntryFormHeaderProps = {
  editingId: number | null;
  onCancel: () => void;
};

export function EntryFormHeader({ editingId, onCancel }: EntryFormHeaderProps) {
  return (
    <div className={panelStyles.panelHeader}>
      <h2>{editingId ? "Редактирование записи" : "Новая запись"}</h2>
      {editingId ? (
        <button type="button" className={buttonStyles.secondaryButton} onClick={onCancel}>
          Отменить
        </button>
      ) : null}
    </div>
  );
}
