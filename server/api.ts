import { z } from "zod";
import { jwt, procedure, protectedProcedure, router } from "./context";
import {
  getChallenge,
  getChallenges,
  getPlayer,
  getPlayers,
  getChallengeByDate,
  getPlayerByEmail,
} from "./utils";
import { db, DbChallenge } from "./db";
import { TRPCError } from "@trpc/server";

const createChallengeQuery = db.query(
  "INSERT INTO challenges (id, player1Id, player2Id, date) VALUES ($id, $player1Id, $player2Id, $date)",
);

const createPlayerQuery = db.query(
  "INSERT INTO players (id, name, password, email) VALUES ($id, $name, $password, $email)",
);

export const challengeRouter = router({
  challenges: procedure.query(() => getChallenges()),
  challengeById: procedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => getChallenge(input.id)),
  challengeByDate: procedure
    .input(z.object({ date: z.string() }))
    .query(({ input }) => getChallengeByDate(input.date)),
  createChallenge: protectedProcedure.input(DbChallenge).query(({ input }) => {
    createChallengeQuery.run(input);
    return getChallenge(input.id);
  }),
});

export const playerRouter = router({
  players: procedure.query(() => getPlayers()),
  playerById: procedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => getPlayer(input.id)),
});

export const authRouter = router({
  me: protectedProcedure.query(({ ctx }) => ctx.player),
  login: procedure
    .input(z.object({ email: z.string(), password: z.string() }))
    .query(async ({ input }) => {
      const player = getPlayerByEmail(input.email);
      if (!player) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid email or password",
        });
      }
      if (await Bun.password.verify(input.password, player.password)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid email or password",
        });
      }
      return { token: await jwt.sign({ id: player.id }) };
    }),
  signup: procedure
    .input(
      z.object({ email: z.string(), password: z.string(), name: z.string() }),
    )
    .query(async ({ input }) => {
      const player = getPlayerByEmail(input.email);
      if (player) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Email already in use",
        });
      }
      const id = crypto.randomUUID();
      const password = await Bun.password.hash(input.password);
      const newPlayer = {
        id,
        password,
        email: input.email,
        name: input.name,
      };
      createPlayerQuery.run(newPlayer);
      return { token: await jwt.sign({ id: newPlayer.id }) };
    }),
});
