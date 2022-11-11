import { useFetcher } from "@remix-run/react";
import { useCallback, useMemo } from "react";

// FIXME: This is unneeded after https://github.com/remix-run/remix/issues/4485
export function useRevalidator() {
  let fetcher = useFetcher();

  let revalidate = useCallback(
    () => {
      fetcher.submit(null, { action: "/", method: "post" });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return useMemo(() => ({ revalidate }), [revalidate]);
}
