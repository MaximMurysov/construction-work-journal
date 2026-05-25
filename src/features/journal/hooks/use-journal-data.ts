import { useCallback, useEffect, useState } from "react";

import { fetchEntries, fetchWorkTypes } from "@/features/journal/lib/api";
import { DEFAULT_FILTERS, JOURNAL_ERRORS } from "@/features/journal/hooks/constants";
import type {
  JournalFilters,
  SortOrder,
  WorkEntry,
  WorkType,
} from "@/features/journal/model/types";

export function useJournalData() {
  const [workTypes, setWorkTypes] = useState<WorkType[]>([]);
  const [entries, setEntries] = useState<WorkEntry[]>([]);
  const [filters, setFilters] = useState<JournalFilters>(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    const [types, nextEntries] = await Promise.all([
      fetchWorkTypes(),
      fetchEntries(filters),
    ]);
    setWorkTypes(types);
    setEntries(nextEntries);
  }, [filters]);

  useEffect(() => {
    let active = true;

    async function loadInitialData() {
      setLoading(true);
      setError(null);

      try {
        const [types, nextEntries] = await Promise.all([
          fetchWorkTypes(),
          fetchEntries(filters),
        ]);

        if (!active) {
          return;
        }

        setWorkTypes(types);
        setEntries(nextEntries);
      } catch {
        if (active) {
          setError(JOURNAL_ERRORS.load);
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
  }, [filters]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await loadData();
    } catch {
      setError(JOURNAL_ERRORS.load);
    } finally {
      setLoading(false);
    }
  }, [loadData]);

  const reloadEntries = useCallback(async () => {
    const nextEntries = await fetchEntries(filters);
    setEntries(nextEntries);
  }, [filters]);

  const setDateFrom = useCallback((dateFrom: string) => {
    setFilters((current) => ({ ...current, dateFrom }));
  }, []);

  const setDateTo = useCallback((dateTo: string) => {
    setFilters((current) => ({ ...current, dateTo }));
  }, []);

  const setSortOrder = useCallback((sortOrder: SortOrder) => {
    setFilters((current) => ({ ...current, sortOrder }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  return {
    workTypes,
    entries,
    filters,
    loading,
    error,
    setError,
    refresh,
    reloadEntries,
    setDateFrom,
    setDateTo,
    setSortOrder,
    resetFilters,
  };
}
