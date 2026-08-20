"use client";

import {
  useSyncExternalStore,
  type ChangeEventHandler,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { compactColumnKeys, headers } from "~/utils/const";
import type { TableData, Columns } from "~/utils/types";

const STORAGE_KEY = "columns-v2";

export const useColumns = () => {
  const localStorageColumns = useSyncExternalStore(
    subscribeToColumns,
    getColumnsSnapshot,
    () => JSON.stringify(fullDefaultColumns),
  );

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;
    const defaults =
      window.innerWidth < 768 ? compactDefaultColumns : fullDefaultColumns;
    const newValue = JSON.stringify(defaults);
    localStorage.setItem(STORAGE_KEY, newValue);
    window.dispatchEvent(
      new StorageEvent("storage", { key: STORAGE_KEY, newValue }),
    );
  }, []);

  const toggleColumn: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const name = e.target.name as keyof TableData;
      const prevColumns = JSON.parse(getColumnsSnapshot()) as Columns;
      const newColumns = {
        ...prevColumns,
        [e.target.name]: !prevColumns[name],
      };
      const newValue = JSON.stringify(newColumns);
      localStorage.setItem(STORAGE_KEY, newValue);
      window.dispatchEvent(
        new StorageEvent("storage", { key: STORAGE_KEY, newValue }),
      );
    },
    [],
  );
  const columns = useMemo(
    () => JSON.parse(localStorageColumns) as Columns,
    [localStorageColumns],
  );
  return [columns, toggleColumn] as const;
};

const subscribeToColumns = (callback: () => void) => {
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("storage", callback);
  };
};

const columnsFromKeys = (enabled: ReadonlySet<string>): Columns =>
  headers.reduce((acc, [key]) => {
    return { ...acc, [key]: enabled.has(key) };
  }, {});

const fullDefaultColumns: Columns = columnsFromKeys(
  new Set(headers.map(([key]) => key)),
);

const compactDefaultColumns: Columns = columnsFromKeys(
  new Set(compactColumnKeys),
);

const getColumnsSnapshot = () => {
  const savedColumns = localStorage.getItem(STORAGE_KEY);
  if (!savedColumns) {
    return JSON.stringify(fullDefaultColumns);
  }

  const parsed = JSON.parse(savedColumns) as Columns;
  const merged = headers.reduce((acc, [key]) => {
    return { ...acc, [key]: parsed[key] ?? true };
  }, {});
  return JSON.stringify(merged);
};
