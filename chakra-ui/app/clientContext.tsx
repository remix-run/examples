import { createContext } from "react";

export interface ClientStyleContextData {
  reset: () => void;
}

export const ClientStyleContext = createContext<ClientStyleContextData | null>(
  null,
);
