const { setupServer } = require("msw/node");

const handlers = require("./handlers.cjs");

const server = setupServer(...handlers);
server.listen({ onUnhandledRequest: "warn" });
console.info("MSW initialized");
