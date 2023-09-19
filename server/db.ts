import { Database } from "bun:sqlite";
import { z } from "zod";

export const db = new Database(Bun.env.DB_URL ?? "db.sqlite", { create: true });
db.run(
  "CREATE TABLE IF NOT EXISTS players (id TEXT PRIMARY KEY, name TEXT NOT NULL, password TEXT NOT NULL, email TEXT NOT NULL UNIQUE)",
);
db.run(
  "CREATE TABLE IF NOT EXISTS challenges (id TEXT PRIMARY KEY, player1Id TEXT NOT NULL, player2Id TEXT NOT NULL, date TEXT NOT NULL)",
);

export const DbPlayer = z.object({
  id: z.string(),
  name: z.string(),
  password: z.string(),
  // Unique email
  email: z.string(),
});

export const Player = DbPlayer;

export const DbChallenge = z.object({
  id: z.string(),
  player1Id: z.string(),
  player2Id: z.string(),
  // Formatted as `YYYY-MM-DD`
  date: z.string(),
});

export const Challenge = z.object({
  id: z.string(),
  player1Id: z.string(),
  player1: Player,
  player2Id: z.string(),
  player2: Player,
  date: z.string(),
});
