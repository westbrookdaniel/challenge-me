import { z } from "zod";
import { procedure, router } from "./context";
import {
  getChallenge,
  getChallenges,
  getPlayer,
  getPlayers,
  getChallengeByDate,
} from "./utils";

export const challengeRouter = router({
  challenges: procedure.query(() => getChallenges()),
  challengeById: procedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => getChallenge(input.id)),
  challengeByDate: procedure
    .input(z.object({ date: z.string() }))
    .query(({ input }) => getChallengeByDate(input.date)),
});

export const playerRouter = router({
  players: procedure.query(() => getPlayers()),
  playerById: procedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => getPlayer(input.id)),
});

// .get("/me", async (c) => {
//   const player = await c.jwt.verify(c.cookie.auth);
//   if (!player) {
//     c.set.status = 401;
//     return "Unauthorized";
//   }
//   return getPlayer(player.id);
// })

// .post(
//   "/challenges",
//   async (c) => {
//     const player = await c.jwt.verify(c.cookie.auth);
//     if (!player) {
//       c.set.status = 401;
//       return "Unauthorized";
//     }

//     db.query(
//       "INSERT INTO challenges (id, player1Id, player2Id, date) VALUES ($id, $player1Id, $player2Id, $date)",
//     ).run(c.body);

//     return getChallenge(c.body.id);
//   },
//   {
//     body: DbChallenge,
//   },
// )

// .post(
//   "/login",
//   async (c) => {
//     const player = getPlayerByEmail(c.body.email);
//     if (!player) {
//       c.set.status = 401;
//       return "Invalid email or password";
//     }
//     if (await Bun.password.verify(c.body.password, player.password)) {
//       c.set.status = 401;
//       return "Invalid email or password";
//     }

//     c.setCookie("auth", await c.jwt.sign({ id: player.id }), {
//       maxAge: 60 * 60 * 24 * 7, // 1 week
//     });

//     return player;
//   },
//   {
//     body: t.Object({ email: t.String(), password: t.String() }),
//   },
// )

// .post(
//   "/signup",
//   async (c) => {
//     const player = getPlayerByEmail(c.body.email);
//     if (player) {
//       c.set.status = 401;
//       return "Email already in use";
//     }
//     const id = crypto.randomUUID();
//     const password = await Bun.password.hash(c.body.password);
//     const newPlayer = {
//       id,
//       password,
//       email: c.body.email,
//       name: c.body.name,
//     };
//     db.query(
//       "INSERT INTO players (id, name, password, email) VALUES ($id, $name, $password, $email)",
//     ).run(newPlayer);

//     return newPlayer;
//   },
//   {
//     body: t.Object({
//       email: t.String(),
//       password: t.String(),
//       name: t.String(),
//     }),
//   },
// )
// .listen(3000);

// export type App = typeof app;
