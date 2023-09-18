import { Player } from "./db";
import { Context, t } from "elysia";


const secret = Bun.env.AUTH_SECkRET;
if (!secret) throw new Error("AUTH_SECRET not set");

export class Auth {
  private sessions: Map<string, { data: unknown; expire: number }> = new Map();

  async set(c: Context, data: unknown) {
    const token = crypto.randomUUID();
    // TODO: increase this to 7 days
    const expire = Date.now() + 1000 * 60 * 60; // 1 hour
    this.sessions.set(token, { data, expire });
    await setSignedCookie(c, "session_token", token, secret!);
  }

  async get(c: Context) {
    const token = await getSignedCookie(c, secret!, "session_token");
    if (!token) return null;
    const session = this.sessions.get(token);
    if (!session) return null;
    if (session.expire < Date.now()) {
      this.sessions.delete(token);
      deleteCookie(c, "session_token");
      return null;
    }
    return session.data;
  }
}
