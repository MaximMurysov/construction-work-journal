"use client";

import { useJournal } from "@/features/journal/hooks/use-journal";

import { EntriesPanel } from "./entries-panel";
import { EntryForm } from "./entry-form";
import { JournalAlert } from "./journal-alert";
import { JournalHeader } from "./journal-header";
import styles from "./journal-screen.module.css";

export function JournalScreen() {
  const journal = useJournal();

  return (
    <div className={styles.page}>
      <JournalHeader />

      {journal.error ? <JournalAlert message={journal.error} /> : null}

      <EntryForm
        editingId={journal.editingId}
        submitting={journal.submitting}
        formValues={journal.formValues}
        fieldErrors={journal.fieldErrors}
        workTypes={journal.workTypes}
        onSubmit={journal.handleSubmit}
        onCancel={journal.resetForm}
        onWorkTypeChange={journal.handleWorkTypeChange}
        onFieldChange={journal.updateFormField}
      />

      <EntriesPanel
        entries={journal.entries}
        filters={journal.filters}
        loading={journal.loading}
        onRefresh={journal.refresh}
        onDateFromChange={journal.setDateFrom}
        onDateToChange={journal.setDateTo}
        onSortOrderChange={journal.setSortOrder}
        onResetFilters={journal.resetFilters}
        onEdit={journal.handleEdit}
        onDelete={journal.handleDelete}
      />
    </div>
  );
}
