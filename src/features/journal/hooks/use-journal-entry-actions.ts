import { FormEvent, useCallback } from "react";

import { JOURNAL_ERRORS } from "@/features/journal/hooks/constants";
import { removeWorkEntry, saveWorkEntry } from "@/features/journal/lib/entry-actions";
import { buildDeleteConfirmMessage } from "@/features/journal/lib/form-utils";
import { getFieldErrors } from "@/features/journal/lib/http";
import type { FieldErrors, WorkEntry, WorkEntryFormValues } from "@/features/journal/model/types";

type UseJournalEntryActionsParams = {
  editingId: number | null;
  formValues: WorkEntryFormValues;
  setSubmitting: (value: boolean) => void;
  setFieldErrors: (errors: FieldErrors) => void;
  setError: (message: string | null) => void;
  resetForm: () => void;
  reloadEntries: () => Promise<void>;
};

export function useJournalEntryActions({
  editingId,
  formValues,
  setSubmitting,
  setFieldErrors,
  setError,
  resetForm,
  reloadEntries,
}: UseJournalEntryActionsParams) {
  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setSubmitting(true);
      setFieldErrors({});
      setError(null);

      try {
        await saveWorkEntry(editingId, formValues);
        resetForm();
        await reloadEntries();
      } catch (caught) {
        const errors = getFieldErrors(caught);
        setFieldErrors(errors ?? {});
        if (!errors) {
          setError(JOURNAL_ERRORS.save);
        }
      } finally {
        setSubmitting(false);
      }
    },
    [editingId, formValues, reloadEntries, resetForm, setError, setFieldErrors, setSubmitting],
  );

  const handleDelete = useCallback(
    async (entry: WorkEntry) => {
      if (!window.confirm(buildDeleteConfirmMessage(entry))) {
        return;
      }

      setError(null);

      try {
        await removeWorkEntry(entry.id);
        if (editingId === entry.id) {
          resetForm();
        }
        await reloadEntries();
      } catch {
        setError(JOURNAL_ERRORS.delete);
      }
    },
    [editingId, reloadEntries, resetForm, setError],
  );

  return { handleSubmit, handleDelete };
}
