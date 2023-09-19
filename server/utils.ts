import { Result, Challenge, DbChallenge, Player, db } from "./db";

export function getPlayers() {
  const data = db.query("SELECT * FROM players").all();
  return data.map((p) => Player.parse(p));
}

export function getPlayersWithChallenges() {
  const data = db.query("SELECT * FROM players").all();
  const challenges = getChallenges();
  return data.map((p) => {
    const player = Player.parse(p);
    const playerChallenges = challenges.filter(
      (c) => c.player1Id === player.id || c.player2Id === player.id,
    );
    return { ...player, challenges };
  });
}

export function getPlayer(id: string) {
  const data = db
    .query("SELECT * FROM players WHERE id = $id")
    .get({ $id: id });
  if (!data) return null;
  return Player.parse(data);
}

export function getPlayerByEmail(email: string) {
  const data = db
    .query("SELECT * FROM players WHERE email = $email")
    .get({ $email: email });
  if (!data) return null;
  return Player.parse(data);
}

export function getChallenges() {
  const data = db.query("SELECT * FROM challenges").all();
  const players = getPlayers();
  return data.map((_c) => {
    const c = DbChallenge.parse(_c);
    const player1 = players.find((p) => p.id === c.player1Id);
    const player2 = players.find((p) => p.id === c.player2Id);
    if (!player1 || !player2) {
      throw new Error(`Players for challenge ${c.id} not found`);
    }
    const result = c.resultId ? getResult(c.resultId) : null;
    return Challenge.parse({ ...c, player1, player2, result });
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
  const result = c.resultId ? getResult(c.resultId) : null;
  return Challenge.parse({ ...c, player1, player2, result });
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
  const result = c.resultId ? getResult(c.resultId) : null;
  return Challenge.parse({ ...c, player1, player2, result });
}

export function getResult(id: string) {
  const data = db
    .query("SELECT * FROM results WHERE id = $id")
    .get({ $id: id });
  if (!data) return null;
  return Result.parse(data);
}
