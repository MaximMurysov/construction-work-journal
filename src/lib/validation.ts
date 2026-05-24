export type WorkEntryInput = {
  performedAt: string;
  workTypeId: number;
  volume: number;
  unit: string;
  executorName: string;
};

export type ValidationResult =
  | { ok: true; data: WorkEntryInput }
  | { ok: false; errors: Record<string, string> };

export function validateWorkEntry(body: unknown): ValidationResult {
  const errors: Record<string, string> = {};

  if (!body || typeof body !== "object") {
    return { ok: false, errors: { form: "Некорректное тело запроса" } };
  }

  const value = body as Record<string, unknown>;
  const performedAt =
    typeof value.performedAt === "string" ? value.performedAt.trim() : "";
  const workTypeId =
    typeof value.workTypeId === "number"
      ? value.workTypeId
      : Number(value.workTypeId);
  const volume =
    typeof value.volume === "number" ? value.volume : Number(value.volume);
  const unit = typeof value.unit === "string" ? value.unit.trim() : "";
  const executorName =
    typeof value.executorName === "string" ? value.executorName.trim() : "";

  if (!performedAt) {
    errors.performedAt = "Укажите дату выполнения";
  } else if (Number.isNaN(Date.parse(performedAt))) {
    errors.performedAt = "Некорректная дата";
  }

  if (!Number.isInteger(workTypeId) || workTypeId <= 0) {
    errors.workTypeId = "Выберите вид работ";
  }

  if (!Number.isFinite(volume) || volume <= 0) {
    errors.volume = "Объём должен быть больше нуля";
  }

  if (!unit) {
    errors.unit = "Укажите единицу измерения";
  }

  if (!executorName) {
    errors.executorName = "Укажите ФИО исполнителя";
  } else if (executorName.length < 3) {
    errors.executorName = "ФИО слишком короткое";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: {
      performedAt,
      workTypeId,
      volume,
      unit,
      executorName,
    },
  };
}
