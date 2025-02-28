import type { Config } from "drizzle-kit";

export default {
  schema: "./app/schema.ts",
  out: "./drizzle",
} satisfies Config;
