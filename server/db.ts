import { Database } from "bun:sqlite";
import { t } from "elysia";

export const db = new Database("db.sqlite", { create: true });
db.run(
  "CREATE TABLE IF NOT EXISTS players (id TEXT PRIMARY KEY, name TEXT NOT NULL, password TEXT NOT NULL, email TEXT NOT NULL UNIQUE)",
);
db.run(
  "CREATE TABLE IF NOT EXISTS challenges (id TEXT PRIMARY KEY, player1Id TEXT NOT NULL, player2Id TEXT NOT NULL, date TEXT NOT NULL)",
);

export const DbPlayer = t.Object({
  id: t.String(),
  name: t.String(),
  password: t.String(),
  // Unique email
  email: t.String(),
});

export const Player = DbPlayer;

export const DbChallenge = t.Object({
  id: t.String(),
  player1Id: t.String(),
  player2Id: t.String(),
  // Formatted as `YYYY-MM-DD`
  date: t.String(),
});

export const Challenge = t.Object({
  id: t.String(),
  player1Id: t.String(),
  player1: Player,
  player2Id: t.String(),
  player2: Player,
  date: t.String(),
});
