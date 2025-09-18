import { defineEventHandler, H3Event, readValidatedBody, setHeader } from "h3";
import { useDrizzle } from "../../utils/database";
import { use4xError } from "../../utils/errorHandler";
import { useHash } from "../../utils/passwordHandler";
import { loginZod } from "../../zod/login.zod";
import { useAuth } from "../../utils/auth";

function sendUnAuthorizationError(event: H3Event) {
  setHeader(
    event,
    "www-authenticate",
    'Bearer realm="auth", error="invalid_credentials", error_description="Invalid username or password'
  );
  return use4xError(event, 401, "Email or password is wrong");
}

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, loginZod.safeParseAsync);
  const db = useDrizzle();
  const hasher = useHash;

  if (!body.success) throw use4xError(event, 400, body.error.message);

  try {
    const user = await db.query.usersTable.findFirst({
      where: (users, { eq }) => eq(users.email, body.data.email),
    });

    if (!user) throw sendUnAuthorizationError(event);

    const isPasswordCorrect = hasher.checkPassword(
      body.data.password,
      user.password
    );
    if (!isPasswordCorrect) throw sendUnAuthorizationError(event);

    const response = await useAuth.login(event, user.id, {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    });
    return response;
  } catch (error) {
    throw sendUnAuthorizationError(event);
  }
});
