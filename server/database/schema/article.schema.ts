import { int, sqliteTable, text, index } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { usersTable } from "./user.schema";
import { categoriesTable } from "./category.schema";

export const articlesTable = sqliteTable(
  "articles",
  {
    id: int("id").primaryKey({ autoIncrement: true }).notNull(),
    authorId: int("author_id").references(() => usersTable.id),
    categoryId: int("category_id").references(() => categoriesTable.id),
    title: text("name", { length: 255 }).notNull(),
    slug: text("slug", { length: 255 }).unique().notNull(),
    content: text().notNull(),
    cover: text(),
    createdAt: int("created_at", { mode: "timestamp" }).default(new Date()),
  },
  (table) => [index("article_idx").on(table.slug)]
);

export const articleRelation = relations(articlesTable, ({ one }) => ({
  author: one(usersTable, {
    fields: [articlesTable.authorId],
    references: [usersTable.id],
  }),
  category: one(categoriesTable, {
    fields: [articlesTable.categoryId],
    references: [categoriesTable.id],
  }),
}));
