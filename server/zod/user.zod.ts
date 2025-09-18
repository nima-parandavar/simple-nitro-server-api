import * as z from "zod";

export const userZod = z.object({
  firstName: z.string().max(60),
  lastName: z.string().max(100),
  role: z.enum(["admin", "user"]).default("user"),
});
