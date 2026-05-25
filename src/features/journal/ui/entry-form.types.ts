import type { FormEvent } from "react";

import type {
  FieldErrors,
  WorkEntryFormValues,
  WorkType,
} from "@/features/journal/model/types";

export type EntryFormFieldHandlers = {
  formValues: WorkEntryFormValues;
  fieldErrors: FieldErrors;
  workTypes: WorkType[];
  onWorkTypeChange: (workTypeId: string) => void;
  onFieldChange: <K extends keyof WorkEntryFormValues>(
    key: K,
    value: WorkEntryFormValues[K],
  ) => void;
};

export type EntryFormProps = EntryFormFieldHandlers & {
  editingId: number | null;
  submitting: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
};
