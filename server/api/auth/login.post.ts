import { defineEventHandler, readValidatedBody, setHeader } from "h3";
import { useDrizzle } from "../../utils/database";
import { use4xError } from "../../utils/errorHandler";
import { useHash } from "../../utils/passwordHandler";
import { loginZod } from "../../zod/login.zod";
import { useAuth } from "../../utils/auth";
import { set2xStatus } from "server/utils/useStatus";

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, loginZod.safeParseAsync);
  const db = useDrizzle();
  const hasher = useHash;

  if (body.success) {
    try {
      const user = await db.query.usersTable.findFirst({
        where: (users, { eq }) => eq(users.email, body.data.email),
      });
      if (user) {
        const isPasswordCorrect = hasher.checkPassword(
          body.data.password,
          user.password
        );
        if (isPasswordCorrect) {
          return await useAuth.login(event, user.id, {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          });
        }
        setHeader(
          event,
          "www-authenticate",
          'Bearer realm="auth", error="invalid_credentials", error_description="Invalid username or password'
        );
        throw use4xError(event, 401, "Email or password is wrong");
      }
      setHeader(
        event,
        "www-authenticate",
        'Bearer realm="auth", error="invalid_credentials", error_description="Invalid username or password'
      );
      throw use4xError(event, 401, "Email or password is wrong");
    } catch (error) {
      setHeader(
        event,
        "www-authenticate",
        'Bearer realm="auth", error="invalid_credentials", error_description="Invalid username or password'
      );
      throw use4xError(event, 401, "Email or password is wrong");
    }
  }
  setHeader(
    event,
    "www-authenticate",
    'Bearer realm="auth", error="invalid_credentials", error_description="Invalid username or password'
  );
  throw use4xError(event, 401, "Email or password is wrong");
});
