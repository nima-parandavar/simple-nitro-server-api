import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { usersTable } from "../database/schema/user.schema";
export { sql, eq, and, or } from "drizzle-orm";

export const tables = { usersTable };

const client = createClient({ url: process.env.DB_FILE_NAME! });

export const useDrizzle = () => {
  return drizzle({ client: client, schema: usersTable });
};

export type User = typeof tables.usersTable.$inferInsert;
