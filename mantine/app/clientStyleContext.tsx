import { createContext } from "react";

export const ClientStyleContext = createContext<{
  reset: () => void;
} | null>(null);
