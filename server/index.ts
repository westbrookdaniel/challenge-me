import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { createContext, router } from "./context";
import { challengeRouter, playerRouter } from "./api";

const appRouter = router({
  challenge: challengeRouter,
  player: playerRouter,
});

export type AppRouter = typeof appRouter;

const { listen } = createHTTPServer({
  router: appRouter,
  createContext,
});

listen(3000);
