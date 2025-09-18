import { int, sqliteTable, text, index } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { articlesTable } from "./article.schema";

export const categoriesTable = sqliteTable(
  "categories",
  {
    id: int("id").primaryKey({ autoIncrement: true }).notNull(),
    name: text("name", { length: 120 }),
    slug: text("slug", { length: 120 }).unique(),
    createdAt: int("created_at", { mode: "timestamp" }).default(new Date()),
  },
  (table) => [index("category_idx").on(table.slug)]
);

export const categoryRelation = relations(categoriesTable, ({ many }) => ({
  articles: many(articlesTable, {
    relationName: "category_articles",
  }),
}));
