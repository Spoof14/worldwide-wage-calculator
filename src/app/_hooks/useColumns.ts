import {
  useSyncExternalStore,
  type ChangeEventHandler,
  useCallback,
  useMemo,
} from "react";
import { headers } from "~/utils/const";
import type { TableData, Columns } from "~/utils/types";

export const useColumns = () => {
  const localStorageColumns = useSyncExternalStore(
    subscribeToColumns,
    getColumnsSnapshot,
    () => JSON.stringify(defaultColumns),
  );

  const toggleColumn: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      const name = e.target.name as keyof TableData;
      const prevColumns = JSON.parse(getColumnsSnapshot()) as Columns;
      const newColumns = {
        ...prevColumns,
        [e.target.name]: !prevColumns[name],
      };
      const newValue = JSON.stringify(newColumns);
      localStorage.setItem("columns", newValue);
      window.dispatchEvent(
        new StorageEvent("storage", { key: "columns", newValue }),
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

const defaultColumns: Columns = headers.reduce((acc, [key]) => {
  return { ...acc, [key]: true };
}, {});

const getColumnsSnapshot = () => {
  const savedColumns = localStorage.getItem("columns");

  if (!savedColumns) {
    const defaultCols = JSON.stringify(defaultColumns);
    localStorage.setItem("columns", defaultCols);
    return defaultCols;
  }
  
  return savedColumns;
};
