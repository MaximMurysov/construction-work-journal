import { EntryFormFields } from "./entry-form-fields";
import { EntryFormHeader } from "./entry-form-header";
import { EntryFormSubmit } from "./entry-form-submit";
import type { EntryFormProps } from "./entry-form.types";
import formStyles from "./entry-form.module.css";
import panelStyles from "./shared/panel.module.css";

export function EntryForm({
  editingId,
  submitting,
  formValues,
  fieldErrors,
  workTypes,
  onSubmit,
  onCancel,
  onWorkTypeChange,
  onFieldChange,
}: EntryFormProps) {
  return (
    <section className={panelStyles.panel}>
      <EntryFormHeader editingId={editingId} onCancel={onCancel} />

      <form className={formStyles.formGrid} onSubmit={onSubmit}>
        <EntryFormFields
          formValues={formValues}
          fieldErrors={fieldErrors}
          workTypes={workTypes}
          onWorkTypeChange={onWorkTypeChange}
          onFieldChange={onFieldChange}
        />
        <EntryFormSubmit editingId={editingId} submitting={submitting} />
      </form>
    </section>
  );
}
