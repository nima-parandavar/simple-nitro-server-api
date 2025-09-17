import * as z from "zod";

export const authZod = z.object({
  firstName: z.string().max(60).nullish(),
  lastName: z.string().max(100).nullish(),
  email: z.email({ pattern: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/ }),
  password: z.string(),
  role: z
    .enum(["user", "admin"], {
      error: "Role must br User or Admin",
    })
    .default("user"),
});
