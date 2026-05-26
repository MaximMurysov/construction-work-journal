import styles from "./journal-header.module.css";

export function JournalHeader() {
  return (
    <header className={styles.header}>
      <div>
        <p className={styles.eyebrow}>Строительный объект</p>
        <h1>Журнал работ</h1>
        <p className={styles.subtitle}>
          Учёт выполненных работ: дата, вид работ, объём и исполнитель.
        </p>
      </div>
    </header>
  );
}
