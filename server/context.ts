import { TRPCError, inferAsyncReturnType, initTRPC } from "@trpc/server";
import { CreateHTTPContextOptions } from "@trpc/server/adapters/standalone";
import * as jose from "jose";
import { getPlayer } from "./utils";
import { z } from "zod";

const _secret = Bun.env.AUTH_SECRET;
if (!_secret) throw new Error("AUTH_SECRET is not defined");
const secret = new TextEncoder().encode(_secret);

const jwtSchema = z.object({ id: z.string() });

// This is how you initialize a context for the server
export async function createContext({ req }: CreateHTTPContextOptions) {
  async function getUserFromHeader() {
    if (req.headers.authorization) {
      const jwt = req.headers.authorization.split(" ")[1];
      const { payload } = await jose.jwtVerify(jwt, secret);
      try {
        const player = getPlayer(jwtSchema.parse(payload).id);
        return player;
      } catch (e) {
        console.error(e);
        return null;
      }
    }
    return null;
  }
  const player = await getUserFromHeader();

  return { player };
}
type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const procedure = t.procedure;

export const protectedProcedure = t.procedure.use(
  t.middleware((opts) => {
    const { ctx } = opts;
    if (!ctx.player?.id) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return opts.next({ ctx: { player: ctx.player } });
  }),
);
