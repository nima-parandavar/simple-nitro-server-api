import { defineEventHandler, readValidatedBody } from "h3";
import { authZod } from "../../zod/signup.zod";
import { use4xError } from "../../utils/errorHandler";
import { useHash } from "../../utils/passwordHandler";
import { usersTable } from "../../database/schema/user.schema";
import { set2xStatus } from "../../utils/useStatus";
import { useLogger } from "../../utils/logger";
import { UserService } from "../../services/user.services";

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, authZod.safeParseAsync);
  const userService = new UserService();

  if (!body.success) throw use4xError(event, 400, body.error.message!);

  const hashPassword = useHash.createPassword(body.data.password);

  try {
    const user = userService.createUser(event, {
      ...body.data,
      password: hashPassword,
    });
    set2xStatus(event, 201);
    useLogger(event, "info", "User create successfully");
    return user;
  } catch (error) {
    throw use4xError(event, 400, error as string);
  }
});
