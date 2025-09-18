import type { AnySQLiteTable } from "drizzle-orm/sqlite-core";
import type { InferInsertModel } from "drizzle-orm";
import { eq } from "drizzle-orm";
import { useDrizzle } from "../utils/database";
import type { H3Event } from "h3";

export abstract class BaseService<T extends AnySQLiteTable> {
  protected table: T;
  protected db = useDrizzle();

  constructor(table: T) {
    this.table = table;
  }

  async create(
    event: H3Event,
    data: InferInsertModel<T>,
    pick?: Record<string, unknown | undefined>
  ): Promise<T["$inferSelect"]> {
    return await this.db.insert(this.table).values(data).returning().get(pick);
  }

  async retrieve(event: H3Event, where?: any): Promise<InferInsertModel<T>> {
    const data = await this.db.select().from(this.table).where(where).limit(1);
    return data[0];
  }

  async delete(event: H3Event, id: number | string): Promise<void> {
    await this.db.delete(this.table).where(eq((this.table as any).id, id));
  }

  async update(
    event: H3Event,
    data: Partial<InferInsertModel<T>>,
    where: any,
    pick?: Record<string, unknown | undefined>
  ): Promise<T["$inferSelect"]> {
    return await this.db
      .update(this.table)
      .set(data)
      .where(where)
      .returning()
      .get(pick);
  }
}
