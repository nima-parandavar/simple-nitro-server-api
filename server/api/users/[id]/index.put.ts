import {
  defineEventHandler,
  getValidatedRouterParams,
  readValidatedBody,
} from "h3";
import { eq, useDrizzle } from "../../../utils/database";
import { use4xError, use5xError } from "../../../utils/errorHandler";
import { userZod } from "../../../zod/user.zod";
import * as z from "zod";
import { usersTable } from "../../../database/schema/user.schema";

const routeParams = z.object({
  id: z.coerce
    .number()
    .int()
    .positive({ error: "id con not set negative numbers" }),
});

export default defineEventHandler(async (event) => {
  const form = userZod.partial();
  const body = await readValidatedBody(event, form.safeParseAsync);
  const params = await getValidatedRouterParams(event, routeParams.safeParse);
  const db = useDrizzle();

  if (!params.success) throw use4xError(event, 400, params.error.message);
  if (!body.success) throw use4xError(event, 400, body.error.message!);

  try {
    const user = await db.query.usersTable.findFirst({
      where: (users, { eq }) => eq(users.id, params.data.id),
    });

    if (!user) throw use4xError(event, 404, "User not found");

    await db
      .update(usersTable)
      .set({ ...body.data })
      .where(eq(usersTable.id, params.data.id));

    const newUser = await db.query.usersTable.findFirst({
      where: (users, { eq }) => eq(users.id, params.data.id),
    });
    return { success: true, data: userZod.parse(newUser) };
  } catch (error) {
    throw use5xError(event, 500, error);
  }
});
