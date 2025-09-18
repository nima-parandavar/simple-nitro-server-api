import { defineEventHandler } from "h3";
import { useAuth } from "server/utils/auth";

export default defineEventHandler(async (event) => {
  return await useAuth.logout(event);
});
