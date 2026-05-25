import { useCallback, useState } from "react";

import { useJournalEntryActions } from "@/features/journal/hooks/use-journal-entry-actions";
import {
  applyWorkTypeUnit,
  emptyFormValues,
  entryToFormValues,
} from "@/features/journal/lib/form-utils";
import type {
  FieldErrors,
  WorkEntry,
  WorkEntryFormValues,
  WorkType,
} from "@/features/journal/model/types";

type UseJournalFormParams = {
  workTypes: WorkType[];
  setError: (message: string | null) => void;
  reloadEntries: () => Promise<void>;
};

export function useJournalForm({ workTypes, setError, reloadEntries }: UseJournalFormParams) {
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formValues, setFormValues] = useState<WorkEntryFormValues>(emptyFormValues);

  const resetForm = useCallback(() => {
    setEditingId(null);
    setFieldErrors({});
    setFormValues(emptyFormValues());
  }, []);

  const updateFormField = useCallback(
    <K extends keyof WorkEntryFormValues>(key: K, value: WorkEntryFormValues[K]) => {
      setFormValues((current) => ({ ...current, [key]: value }));
    },
    [],
  );

  const handleWorkTypeChange = useCallback(
    (workTypeId: string) => {
      setFormValues((current) => applyWorkTypeUnit(current, workTypeId, workTypes));
    },
    [workTypes],
  );

  const handleEdit = useCallback((entry: WorkEntry) => {
    setEditingId(entry.id);
    setFieldErrors({});
    setFormValues(entryToFormValues(entry));
  }, []);

  const { handleSubmit, handleDelete } = useJournalEntryActions({
    editingId,
    formValues,
    setSubmitting,
    setFieldErrors,
    setError,
    resetForm,
    reloadEntries,
  });

  return {
    submitting,
    fieldErrors,
    editingId,
    formValues,
    resetForm,
    updateFormField,
    handleWorkTypeChange,
    handleSubmit,
    handleEdit,
    handleDelete,
  };
}
