import { defineEventHandler, getValidatedRouterParams } from "h3";
import { eq, useDrizzle } from "../../../utils/database";

import * as z from "zod";
import { use4xError, use5xError } from "../../../utils/errorHandler";
import { usersTable } from "../../../database/schema/user.schema";

const routeParams = z.object({
  id: z.coerce
    .number()
    .int()
    .positive({ error: "id con not set negative numbers" }),
});

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(
    event,
    routeParams.safeParseAsync
  );
  const db = useDrizzle();

  if (!params.success) throw use4xError(event, 400, params.error.message);

  try {
    const user = await db.query.usersTable.findFirst({
      where: (users, { eq }) => eq(users.id, params.data.id),
    });

    if (!user) throw use4xError(event, 404, "User not found");

    await db.delete(usersTable).where(eq(usersTable.id, params.data.id));
    return { success: true, data: null };
  } catch (error) {
    throw use5xError(event, 500, error);
  }
});
