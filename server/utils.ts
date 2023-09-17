import { Challenge, DbChallenge, DbPlayer, Player, db } from "./db";

export function getPlayers() {
  const data = db.query("SELECT * FROM players").all();
  return data.map((p) => DbPlayer.parse(p));
}

export function getPlayer(id: string) {
  const data = db
    .query("SELECT * FROM players WHERE id = $id")
    .get({ $id: id });
  if (!data) return null;
  return DbPlayer.parse(data);
}

export function getPlayerByEmail(email: string) {
  const data = db
    .query("SELECT * FROM players WHERE email = $email")
    .get({ $email: email });
  if (!data) return null;
  return DbPlayer.parse(data);
}

export function getChallenges() {
  const data = db.query("SELECT * FROM challenges").all();
  const players = getPlayers();
  return data.map((p) => {
    const c = DbChallenge.parse(p);
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
  const c = DbChallenge.parse(data);
  const player1 = getPlayer(c.player1Id);
  const player2 = getPlayer(c.player2Id);
  if (!player1 || !player2) {
    throw new Error(`Players for challenge ${c.id} not found`);
  }
  return { ...c, player1, player2 };
}

export function getChallenge(id: string) {
  const data = db
    .query("SELECT * FROM challenges WHERE id = $id")
    .get({ $id: id });
  if (!data) return null;
  const c = DbChallenge.parse(data);
  const player1 = getPlayer(c.player1Id);
  const player2 = getPlayer(c.player2Id);
  if (!player1 || !player2) {
    throw new Error(`Players for challenge ${c.id} not found`);
  }
  return { ...c, player1, player2 };
}
