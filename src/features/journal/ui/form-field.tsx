import type { ReactNode } from "react";

import styles from "./form-field.module.css";

type FormFieldProps = {
  label: string;
  error?: string;
  wide?: boolean;
  children: ReactNode;
};

export function FormField({ label, error, wide, children }: FormFieldProps) {
  return (
    <label className={`${styles.field}${wide ? ` ${styles.fieldWide}` : ""}`}>
      <span>{label}</span>
      {children}
      {error ? <small className={styles.fieldError}>{error}</small> : null}
    </label>
  );
}
