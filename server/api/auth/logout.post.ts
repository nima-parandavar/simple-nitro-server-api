import { defineEventHandler } from "h3";
import { useAuth } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  return await useAuth.logout(event);
});
