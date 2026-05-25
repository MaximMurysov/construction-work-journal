import { useJournalData } from "@/features/journal/hooks/use-journal-data";
import { useJournalForm } from "@/features/journal/hooks/use-journal-form";

export function useJournal() {
  const data = useJournalData();
  const form = useJournalForm({
    workTypes: data.workTypes,
    setError: data.setError,
    reloadEntries: data.reloadEntries,
  });

  return {
    workTypes: data.workTypes,
    entries: data.entries,
    filters: data.filters,
    loading: data.loading,
    submitting: form.submitting,
    error: data.error,
    fieldErrors: form.fieldErrors,
    editingId: form.editingId,
    formValues: form.formValues,
    refresh: data.refresh,
    resetForm: form.resetForm,
    updateFormField: form.updateFormField,
    handleWorkTypeChange: form.handleWorkTypeChange,
    handleSubmit: form.handleSubmit,
    handleEdit: form.handleEdit,
    handleDelete: form.handleDelete,
    setDateFrom: data.setDateFrom,
    setDateTo: data.setDateTo,
    setSortOrder: data.setSortOrder,
    resetFilters: data.resetFilters,
  };
}
