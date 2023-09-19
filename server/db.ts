import { Database } from "bun:sqlite";
import { z } from "zod";
import fs from "fs";

export const db = new Database(Bun.env.DB_URL ?? "db.sqlite", { create: true });

// Handle migrations
db.run("CREATE TABLE IF NOT EXISTS migrations (id TEXT PRIMARY KEY)");
type Migration = { id: string };
const runMigrations = db.query("SELECT * FROM migrations").all() as Migration[];
// Read all files in the migrations folder
const migrations = fs.readdirSync("./server/migrations").map((file) => {
  const id = parseInt(file.replace(".sql", ""));
  return { id, sql: fs.readFileSync(`./server/migrations/${file}`, "utf-8") };
});
// Sort them by id
migrations.sort((a, b) => a.id - b.id);
// Run all migrations that haven't been run yet
for (const migration of migrations) {
  if (!runMigrations?.find((m) => m.id === migration.id.toString())) {
    console.log(`Running migration ${migration.id}`);
    migration.sql.split(";").forEach((sql) => {
      if (sql.trim() === "") return;
      db.query(sql.trim()).run();
    });
    db.query("INSERT INTO migrations (id) VALUES ($id)").run({
      $id: migration.id,
    });
  }
}

export const Player = z.object({
  id: z.string(),
  name: z.string(),
  password: z.string(),
  // Unique email
  email: z.string(),
});

export const Result = z.object({
  id: z.string(),
  winner: z.string(),
  info: z.string(),
});

export const DbChallenge = z.object({
  id: z.string(),
  player1Id: z.string(),
  player2Id: z.string(),
  resultId: z.string().nullable(),
  // Formatted as `YYYY-MM-DD`
  date: z.string(),
});

export const Challenge = z.object({
  id: z.string(),
  player1Id: z.string(),
  player1: Player,
  player2Id: z.string(),
  player2: Player,
  // Formatted as `YYYY-MM-DD`
  date: z.string(),
  resultId: z.string().nullable(),
  result: Result.nullable(),
});
