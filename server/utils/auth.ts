import {
  clearSession,
  getSession,
  SessionConfig,
  updateSession,
  type H3Event,
} from "h3";
import type { Auth } from "server/types/auth";
import { useLogger } from "./logger";
import { SessionDataType } from "server/types/session";

class SessionAuthentication {
  private sessionKey = process.env.SESSION_KEY!;
  private sessionName = "user-session";
  private sessionMaxAge =
    60 * 60 * 24 * Number(process.env.SESSION_MAX_AGE ?? 7);
  private secure = process.env.NODE_ENV === "production";
  private httpOnly = true;
  private sameSite = process.env.NODE_ENV === "production" ? "strict" : "lax";

  private get sessionConfig(): SessionConfig {
    return {
      password: this.sessionKey,
      cookie: {
        sameSite: this.sameSite,
        secure: this.secure,
        maxAge: this.sessionMaxAge,
        httpOnly: this.httpOnly,
      },
      name: this.sessionName,
    };
  }

  private async isSessionExpired(event: H3Event): Promise<boolean> {
    const session = await getSession<SessionDataType>(
      event,
      this.sessionConfig
    );
    return Date.now() > session.data.expireAt;
  }

  async login(event: H3Event, id: number, data: Auth) {
    try {
      const session = await updateSession<SessionDataType>(
        event,
        this.sessionConfig,
        {
          user: {
            id: id,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            role: data.role,
          },
          expireAt: Date.now() + this.sessionMaxAge * 1000,
        }
      );
      return {
        success: true,
        user: session.data.user,
      };
    } catch (error) {
      useLogger(event, "error", error);
      return { success: false, user: null };
    }
  }

  async getInfo(event: H3Event): Promise<Auth> {
    const isSessionExpired = await this.isSessionExpired(event);
    if (!isSessionExpired) {
      const session = await getSession<SessionDataType>(
        event,
        this.sessionConfig
      );
      return session.data.user;
    }
    throw Error("Session expired");
  }

  async logout(event: H3Event): Promise<{ success: boolean }> {
    try {
      await clearSession(event, this.sessionConfig);
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  }
}

export const useAuth = new SessionAuthentication();
