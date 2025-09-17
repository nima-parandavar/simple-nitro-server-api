import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./server/database",
  schema: "./server/database/schema",
  dialect: "sqlite",
  casing: "snake_case",
  dbCredentials: {
    url: process.env.DB_FILE_NAME!,
  },
});
