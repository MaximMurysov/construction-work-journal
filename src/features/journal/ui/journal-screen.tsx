"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

import {
  emptyFormValues,
  entryToFormValues,
  formValuesToPayload,
  type WorkEntry,
  type WorkEntryFormValues,
  type WorkType,
} from "@/features/journal/model/types";

import styles from "./journal-screen.module.css";

type SortOrder = "asc" | "desc";

async function readJson<T>(response: Response): Promise<T> {
  const data = (await response.json()) as T;
  if (!response.ok) {
    throw data;
  }
  return data;
}

export function JournalScreen() {
  const [workTypes, setWorkTypes] = useState<WorkType[]>([]);
  const [entries, setEntries] = useState<WorkEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formValues, setFormValues] = useState<WorkEntryFormValues>(emptyFormValues);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const workTypeMap = useMemo(
    () => new Map(workTypes.map((workType) => [workType.id, workType])),
    [workTypes],
  );

  const loadWorkTypes = useCallback(async () => {
    const data = await readJson<WorkType[]>(await fetch("/api/work-types"));
    return data;
  }, []);

  const loadEntries = useCallback(async () => {
    const params = new URLSearchParams();
    if (dateFrom) params.set("from", dateFrom);
    if (dateTo) params.set("to", dateTo);
    params.set("sort", sortOrder);

    const data = await readJson<WorkEntry[]>(
      await fetch(`/api/entries?${params.toString()}`),
    );
    return data;
  }, [dateFrom, dateTo, sortOrder]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [types, nextEntries] = await Promise.all([loadWorkTypes(), loadEntries()]);
      setWorkTypes(types);
      setEntries(nextEntries);
    } catch {
      setError("Не удалось загрузить данные. Проверьте, что база данных запущена.");
    } finally {
      setLoading(false);
    }
  }, [loadEntries, loadWorkTypes]);

  useEffect(() => {
    let active = true;

    async function loadInitialData() {
      setLoading(true);
      setError(null);

      try {
        const [types, nextEntries] = await Promise.all([loadWorkTypes(), loadEntries()]);
        if (!active) {
          return;
        }
        setWorkTypes(types);
        setEntries(nextEntries);
      } catch {
        if (active) {
          setError("Не удалось загрузить данные. Проверьте, что база данных запущена.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadInitialData();

    return () => {
      active = false;
    };
  }, [loadEntries, loadWorkTypes]);

  function resetForm() {
    setEditingId(null);
    setFieldErrors({});
    setFormValues(emptyFormValues());
  }

  function handleWorkTypeChange(workTypeId: string) {
    const workType = workTypeMap.get(Number(workTypeId));
    setFormValues((current) => ({
      ...current,
      workTypeId,
      unit: workType?.defaultUnit ?? current.unit,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setFieldErrors({});
    setError(null);

    const payload = formValuesToPayload(formValues);
    const url = editingId ? `/api/entries/${editingId}` : "/api/entries";
    const method = editingId ? "PUT" : "POST";

    try {
      await readJson<WorkEntry>(
        await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }),
      );
      resetForm();
      const nextEntries = await loadEntries();
      setEntries(nextEntries);
    } catch (caught) {
      if (
        caught &&
        typeof caught === "object" &&
        "errors" in caught &&
        caught.errors &&
        typeof caught.errors === "object"
      ) {
        setFieldErrors(caught.errors as Record<string, string>);
      } else {
        setError("Не удалось сохранить запись.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(entry: WorkEntry) {
    const confirmed = window.confirm(
      `Удалить запись от ${entry.performedAt} (${entry.workTypeName})?`,
    );

    if (!confirmed) {
      return;
    }

    setError(null);

    try {
      await readJson<{ ok: boolean }>(
        await fetch(`/api/entries/${entry.id}`, { method: "DELETE" }),
      );

      if (editingId === entry.id) {
        resetForm();
      }

      const nextEntries = await loadEntries();
      setEntries(nextEntries);
    } catch {
      setError("Не удалось удалить запись.");
    }
  }

  function handleEdit(entry: WorkEntry) {
    setEditingId(entry.id);
    setFieldErrors({});
    setFormValues(entryToFormValues(entry));
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Строительный объект</p>
          <h1>Журнал работ</h1>
          <p className={styles.subtitle}>
            Учёт выполненных работ: дата, вид работ, объём и исполнитель.
          </p>
        </div>
      </header>

      {error ? <div className={styles.alert}>{error}</div> : null}

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <h2>{editingId ? "Редактирование записи" : "Новая запись"}</h2>
          {editingId ? (
            <button type="button" className={styles.secondaryButton} onClick={resetForm}>
              Отменить
            </button>
          ) : null}
        </div>

        <form className={styles.formGrid} onSubmit={handleSubmit}>
          <label className={styles.field}>
            <span>Дата выполнения</span>
            <input
              type="date"
              value={formValues.performedAt}
              onChange={(event) =>
                setFormValues((current) => ({
                  ...current,
                  performedAt: event.target.value,
                }))
              }
              required
            />
            {fieldErrors.performedAt ? (
              <small className={styles.fieldError}>{fieldErrors.performedAt}</small>
            ) : null}
          </label>

          <label className={styles.field}>
            <span>Вид работ</span>
            <select
              value={formValues.workTypeId}
              onChange={(event) => handleWorkTypeChange(event.target.value)}
              required
            >
              <option value="">Выберите вид работ</option>
              {workTypes.map((workType) => (
                <option key={workType.id} value={workType.id}>
                  {workType.name}
                </option>
              ))}
            </select>
            {fieldErrors.workTypeId ? (
              <small className={styles.fieldError}>{fieldErrors.workTypeId}</small>
            ) : null}
          </label>

          <label className={styles.field}>
            <span>Объём</span>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={formValues.volume}
              onChange={(event) =>
                setFormValues((current) => ({
                  ...current,
                  volume: event.target.value,
                }))
              }
              placeholder="24"
              required
            />
            {fieldErrors.volume ? (
              <small className={styles.fieldError}>{fieldErrors.volume}</small>
            ) : null}
          </label>

          <label className={styles.field}>
            <span>Единица измерения</span>
            <input
              type="text"
              value={formValues.unit}
              onChange={(event) =>
                setFormValues((current) => ({
                  ...current,
                  unit: event.target.value,
                }))
              }
              placeholder="м³"
              required
            />
            {fieldErrors.unit ? (
              <small className={styles.fieldError}>{fieldErrors.unit}</small>
            ) : null}
          </label>

          <label className={`${styles.field} ${styles.fieldWide}`}>
            <span>ФИО исполнителя</span>
            <input
              type="text"
              value={formValues.executorName}
              onChange={(event) =>
                setFormValues((current) => ({
                  ...current,
                  executorName: event.target.value,
                }))
              }
              placeholder="Иванов П.С."
              required
            />
            {fieldErrors.executorName ? (
              <small className={styles.fieldError}>{fieldErrors.executorName}</small>
            ) : null}
          </label>

          <div className={styles.formActions}>
            <button type="submit" className={styles.primaryButton} disabled={submitting}>
              {submitting
                ? "Сохранение..."
                : editingId
                  ? "Сохранить изменения"
                  : "Добавить запись"}
            </button>
          </div>
        </form>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <h2>Записи журнала</h2>
          <button type="button" className={styles.secondaryButton} onClick={() => void refresh()}>
            Обновить
          </button>
        </div>

        <div className={styles.filters}>
          <label className={styles.filterField}>
            <span>С даты</span>
            <input
              type="date"
              value={dateFrom}
              onChange={(event) => setDateFrom(event.target.value)}
            />
          </label>

          <label className={styles.filterField}>
            <span>По дату</span>
            <input
              type="date"
              value={dateTo}
              onChange={(event) => setDateTo(event.target.value)}
            />
          </label>

          <label className={styles.filterField}>
            <span>Сортировка</span>
            <select
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value as SortOrder)}
            >
              <option value="desc">Сначала новые</option>
              <option value="asc">Сначала старые</option>
            </select>
          </label>

          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => {
              setDateFrom("");
              setDateTo("");
              setSortOrder("desc");
            }}
          >
            Сбросить фильтры
          </button>
        </div>

        {loading ? (
          <p className={styles.emptyState}>Загрузка...</p>
        ) : entries.length === 0 ? (
          <p className={styles.emptyState}>Записей пока нет.</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Дата</th>
                  <th>Вид работ</th>
                  <th>Объём</th>
                  <th>Исполнитель</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id}>
                    <td>{entry.performedAt}</td>
                    <td>{entry.workTypeName}</td>
                    <td>
                      {entry.volume} {entry.unit}
                    </td>
                    <td>{entry.executorName}</td>
                    <td>
                      <div className={styles.rowActions}>
                        <button
                          type="button"
                          className={styles.linkButton}
                          onClick={() => handleEdit(entry)}
                        >
                          Изменить
                        </button>
                        <button
                          type="button"
                          className={styles.dangerButton}
                          onClick={() => void handleDelete(entry)}
                        >
                          Удалить
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
