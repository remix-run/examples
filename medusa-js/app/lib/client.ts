import Medusa from "@medusajs/medusa-js";

const BACKEND_URL = process.env.PUBLIC_MEDUSA_URL || "http://localhost:9000";

export const createClient = () =>
  new Medusa({ baseUrl: BACKEND_URL, maxRetries: 3 });
