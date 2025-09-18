import { defineEventHandler } from "h3";
import { useAuth } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  const user = await useAuth.getInfo(event);
  return user;
});
