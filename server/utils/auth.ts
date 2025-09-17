import { getHeader, useSession, type H3Event } from "h3";
import jwt from "jsonwebtoken";
import type { Auth } from "server/types/auth";
import { useLogger } from "./logger";

class BasicAuthentication {
  private secretKey = process.env.SECRET_KEY!;
  private sessionKey = process.env.SESSION_KEY!;
  private expire = "1h";

  constructor(expire_time?: string) {
    if (!this.secretKey) {
      throw Error("SECRET_KEY must be set");
    }
    if (expire_time) {
      this.expire = expire_time;
    }
  }

  generateToken(userId: number) {
    return jwt.sign({ id: userId }, this.secretKey, { expiresIn: this.expire });
  }

  verify(token: string) {
    const decoded = jwt.verify(token, this.secretKey);
    return decoded && Date.now() < decoded.exp * 1000;
  }

  async login(event: H3Event, id: number, data: Auth): Promise<string> {
    const token = this.generateToken(id);
    try {
      const session = await useSession(event, {
        password: this.sessionKey,
        name: "auth",
        cookie: {
          secure: true,
        },
      });
      await session.update({
        info: data,
      });
      return token;
    } catch (error) {
      useLogger(event, "error", error);
      throw Error(error);
    }
  }

  async getInfo(event: H3Event): Promise<Auth> {
    const token = await getHeader(event, "Authorization");
    console.log(token, "===============");
    if (token) {
      const isVerified = this.verify(token);
      if (isVerified) {
        const session = await useSession(event, {
          password: this.sessionKey,
          cookie: { secure: true },
        });
        return session.data.info as Auth;
      }
      throw Error("Invalid token");
    }
    throw Error("Token must be set");
  }
}

export const useAuth = new BasicAuthentication();
