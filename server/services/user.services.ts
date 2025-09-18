import { H3Event } from "h3";
import { usersTable } from "../database/schema/user.schema";
import { BaseService } from "./base";
import { InferInsertModel } from "drizzle-orm";
import { userResponseZod } from "../zod/user.zod";

export class UserService extends BaseService<typeof usersTable> {
  constructor() {
    super(usersTable);
  }

  async createUser(event: H3Event, data: InferInsertModel<typeof usersTable>) {
    const newUser = await this.create(event, data);
    // send verify email to user
    return userResponseZod.parse(newUser);
  }
}
