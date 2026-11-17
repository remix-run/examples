import { setupServer } from "msw/node";
import { handlers } from "./handlers.js";

const server = setupServer(...handlers);
server.listen({ onUnhandledRequest: "warn" });
console.info("MSW initialized");
