import { defineEventHandler, readValidatedBody } from "h3";
import { authZod } from "../../zod/signup.zod";
import { use4xError } from "../../utils/errorHandler";
import { useHash } from "../../utils/passwordHandler";
import { useDrizzle } from "../../utils/database";
import { usersTable } from "../../database/schema/user.schema";
import { set2xStatus } from "../../utils/useStatus";
import { useLogger } from "../../utils/logger";

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, authZod.safeParseAsync);

  if (!body.success) throw use4xError(event, 400, body.error.message!);

  const hashPassword = useHash.createPassword(body.data.password);
  const db = useDrizzle();

  try {
    const user = await db
      .insert(usersTable)
      .values({ ...body.data, password: hashPassword })
      .returning()
      .get({
        id: usersTable.id,
        email: usersTable.email,
        firsName: usersTable.firstName,
        lastName: usersTable.lastName,
      });
    set2xStatus(event, 201);
    useLogger(event, "info", "User create successfully");
    return user;
  } catch (error) {
    throw use4xError(event, 400, error as string);
  }
});
