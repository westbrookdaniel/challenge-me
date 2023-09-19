import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { createContext, router } from "./context";
import cors from "cors";
import { authRouter, challengeRouter, playerRouter } from "./api";

const appRouter = router({
  challenge: challengeRouter,
  player: playerRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;

const { listen } = createHTTPServer({
  middleware: cors(),
  router: appRouter,
  createContext,
});

listen(Bun.env.PORT ? parseInt(Bun.env.PORT) : 3000);
