import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createContext, router } from "./context";
import { authRouter, challengeRouter, playerRouter } from "./api";

const appRouter = router({
  challenge: challengeRouter,
  player: playerRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;

Bun.serve({
  port: Bun.env.PORT ? parseInt(Bun.env.PORT) : 3000,
  fetch: async (req) => {
    if (req.method === "OPTIONS") {
      return new Response("", {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
        },
      });
    }

    const pathname = new URL(req.url).pathname;
    if (!pathname.startsWith("/trpc") && Bun.env.NODE_ENV === "production") {
      const filePath = "./dist" + pathname;
      const file = Bun.file(filePath);
      if (await file.exists()) return new Response(file);
      return new Response(Bun.file("./dist/index.html"));
    }

    const res = await fetchRequestHandler({
      endpoint: "/trpc",
      req,
      router: appRouter,
      createContext,
    });

    res.headers.set("Access-Control-Allow-Origin", "*");

    return res;
  },
});
