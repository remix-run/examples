import { useMemo } from "react";
import { useDataRefresh } from "remix-utils";

// FIXME: This is unneeded after https://github.com/remix-run/remix/issues/4485
export function useRevalidator() {
  const { refresh } = useDataRefresh();

  return useMemo(() => ({ revalidate: refresh }), [refresh]);
}
