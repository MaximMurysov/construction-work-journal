import type { ApiValidationError, FieldErrors } from "@/features/journal/model/types";

export async function readJson<T>(response: Response): Promise<T> {
  const data = (await response.json()) as T;
  if (!response.ok) {
    throw data;
  }
  return data;
}

export function isValidationError(value: unknown): value is ApiValidationError {
  return (
    typeof value === "object" &&
    value !== null &&
    "errors" in value &&
    typeof value.errors === "object" &&
    value.errors !== null
  );
}

export function getFieldErrors(value: unknown): FieldErrors | null {
  return isValidationError(value) ? value.errors : null;
}
