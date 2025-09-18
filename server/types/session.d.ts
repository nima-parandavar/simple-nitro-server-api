import { SessionData } from "h3";
import { Auth } from "./auth";

export type SessionDataType = SessionData<{
  user: Auth;
  expireAt: number;
}>;
