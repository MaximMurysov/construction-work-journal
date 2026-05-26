import styles from "./journal-alert.module.css";

type JournalAlertProps = {
  message: string;
};

export function JournalAlert({ message }: JournalAlertProps) {
  return <div className={styles.alert}>{message}</div>;
}
