import { int, sqliteTable, text, index } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { articlesTable } from "./article.schema";

export const usersTable = sqliteTable(
  "users",
  {
    id: int("id").primaryKey({ autoIncrement: true }),
    firstName: text("first_name", { length: 60 }),
    lastName: text("last_name", { length: 100 }),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    role: text({ enum: ["user", "admin"] }).default("user"),
    isActive: int("is_active", { mode: "boolean" }).default(false),
  },
  (table) => [index("email_idx").on(table.email)]
);

export const userRelation = relations(usersTable, ({ many }) => ({
  articles: many(articlesTable, {
    relationName: "user_articles",
  }),
}));
