import { Value } from "@sinclair/typebox/value";
import { Challenge, DbChallenge, Player, db } from "./db";

export function getPlayers() {
  const data = db.query("SELECT * FROM players").all();
  return data.map((p) => Player.parse(p));
}

export function getPlayer(id: string) {
  const data = db
    .query("SELECT * FROM players WHERE id = $id")
    .get({ $id: id });
  if (!data) return null;
  if (!Value.Check(Player, data)) throw new Error("Invalid");
  return data;
}

export function getPlayerByEmail(email: string) {
  const data = db
    .query("SELECT * FROM players WHERE email = $email")
    .get({ $email: email });
  if (!data) return null;
  if (!Value.Check(Player, data)) throw new Error("Invalid");
  return data;
}

export function getChallenges() {
  const data = db.query("SELECT * FROM challenges").all();
  const players = getPlayers();
  return data.map((c) => {
    if (!Value.Check(DbChallenge, c)) throw new Error("Invalid");
    const player1 = players.find((p) => p.id === c.player1Id);
    const player2 = players.find((p) => p.id === c.player2Id);
    if (!player1 || !player2) {
      throw new Error(`Players for challenge ${c.id} not found`);
    }
    return Challenge.parse({ ...c, player1, player2 });
  });
}

export function getChallengeByDate(date: string) {
  const data = db
    .query("SELECT * FROM challenges WHERE date = $date")
    .get({ $date: date });
  if (!data) return null;
  if (!Value.Check(DbChallenge, data)) throw new Error("Invalid");
  const player1 = getPlayer(data.player1Id);
  const player2 = getPlayer(data.player2Id);
  if (!player1 || !player2) {
    throw new Error(`Players for challenge ${data.id} not found`);
  }
  return { ...data, player1, player2 };
}

export function getChallenge(id: string) {
  const data = db
    .query("SELECT * FROM challenges WHERE id = $id")
    .get({ $id: id });
  if (!data) return null;
  if (!Value.Check(DbChallenge, data)) throw new Error("Invalid");
  const player1 = getPlayer(data.player1Id);
  const player2 = getPlayer(data.player2Id);
  if (!player1 || !player2) {
    throw new Error(`Players for challenge ${data.id} not found`);
  }
  return { ...data, player1, player2 };
}
