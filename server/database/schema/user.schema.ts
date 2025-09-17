import { int, sqliteTable, text, index } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable(
  "users",
  {
    id: int("id").primaryKey({ autoIncrement: true }),
    firstName: text("first_name", { length: 60 }),
    lastName: text("last_name", { length: 100 }),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    role: text({ enum: ["user", "admin"] }).default("user"),
  },
  (table) => [index("email_idx").on(table.email)]
);
