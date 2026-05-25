import type { EntryFormFieldHandlers } from "./entry-form.types";
import { FormField } from "./form-field";

export function EntryFormFields({
  formValues,
  fieldErrors,
  workTypes,
  onWorkTypeChange,
  onFieldChange,
}: EntryFormFieldHandlers) {
  return (
    <>
      <FormField label="Дата выполнения" error={fieldErrors.performedAt}>
        <input
          type="date"
          value={formValues.performedAt}
          onChange={(event) => onFieldChange("performedAt", event.target.value)}
          required
        />
      </FormField>

      <FormField label="Вид работ" error={fieldErrors.workTypeId}>
        <select
          value={formValues.workTypeId}
          onChange={(event) => onWorkTypeChange(event.target.value)}
          required
        >
          <option value="">Выберите вид работ</option>
          {workTypes.map((workType) => (
            <option key={workType.id} value={workType.id}>
              {workType.name}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Объём" error={fieldErrors.volume}>
        <input
          type="number"
          min="0.01"
          step="0.01"
          value={formValues.volume}
          onChange={(event) => onFieldChange("volume", event.target.value)}
          placeholder="24"
          required
        />
      </FormField>

      <FormField label="Единица измерения" error={fieldErrors.unit}>
        <input
          type="text"
          value={formValues.unit}
          onChange={(event) => onFieldChange("unit", event.target.value)}
          placeholder="м³"
          required
        />
      </FormField>

      <FormField label="ФИО исполнителя" error={fieldErrors.executorName} wide>
        <input
          type="text"
          value={formValues.executorName}
          onChange={(event) => onFieldChange("executorName", event.target.value)}
          placeholder="Иванов П.С."
          required
        />
      </FormField>
    </>
  );
}
