import * as z from "zod";

export const loginZod = z.object({
  email: z.email({ pattern: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/ }),
  password: z.string({ error: "Password is required" }),
});
