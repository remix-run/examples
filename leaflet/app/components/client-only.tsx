import type { ReactNode } from "react";
import { useState, useEffect } from "react";

type Props = {
  children(): ReactNode;
  fallback?: ReactNode;
};

let hydrating = true;

export function ClientOnly({ children, fallback = null }: Props) {
  const [hydrated, setHydrated] = useState(() => !hydrating);

  useEffect(function hydrate() {
    hydrating = false;
    setHydrated(true);
  }, []);

  return hydrated ? <>{children()}</> : <>{fallback}</>;
}
