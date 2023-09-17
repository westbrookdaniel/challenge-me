import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { DbChallenge, db } from "./db";
import {
  getChallenge,
  getChallenges,
  getPlayer,
  getPlayerByEmail,
  getPlayers,
  getChallengeByDate,
} from "./utils";
import { SessionMap } from "./SessionMap";

const sessions = new SessionMap();
const api = new Hono()
  .get("/challenges", (c) => c.jsonT(getChallenges()))
  .get("/challenges/:id", (c) => c.jsonT(getChallenge(c.req.param("id"))))
  .get("/challenges-by-date/:date", (c) =>
    c.jsonT(getChallengeByDate(c.req.param("date"))),
  )
  .get("/players", (c) => c.jsonT(getPlayers()))
  .get("/players/:id", (c) => c.jsonT(getPlayer(c.req.param("id"))))
  .get("/me", async (c) => c.jsonT(await sessions.get(c)))
  .post("/challenges", zValidator("json", DbChallenge), async (c) => {
    const player = await sessions.get(c);
    if (!player) throw new Error("Unauthorized");

    const data = c.req.valid("json");
    db.query(
      "INSERT INTO challenges (id, player1Id, player2Id, date) VALUES ($id, $player1Id, $player2Id, $date)",
    ).run(data);

    return c.jsonT(getChallenge(data.id));
  })
  .post(
    "/login",
    zValidator("form", z.object({ email: z.string(), password: z.string() })),
    async (c) => {
      const data = c.req.valid("form");
      const player = getPlayerByEmail(data.email);
      if (!player) {
        return c.jsonT({ message: "Invalid email or password" }, 401);
      }
      if (await Bun.password.verify(data.password, player.password)) {
        return c.jsonT({ message: "Invalid email or password" }, 401);
      }
      await sessions.set(c, player);
      return c.redirect("/");
    },
  )
  .post(
    "/signup",
    zValidator(
      "json",
      z.object({ email: z.string(), password: z.string(), name: z.string() }),
    ),
    async (c) => {
      const data = c.req.valid("json");
      const player = getPlayerByEmail(data.email);
      if (player) {
        return c.jsonT({ message: "Email already in use" }, 401);
      }
      const id = crypto.randomUUID();
      const password = await Bun.password.hash(data.password);
      const newPlayer = { id, password, email: data.email, name: data.name };
      db.query(
        "INSERT INTO players (id, name, password, email) VALUES ($id, $name, $password, $email)",
      ).run(newPlayer);
      await sessions.set(c, newPlayer);
      return c.redirect("/");
    },
  );

export default api;

export type ApiType = typeof api;
