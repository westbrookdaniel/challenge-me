CREATE TABLE IF NOT EXISTS players (id TEXT PRIMARY KEY, name TEXT NOT NULL, password TEXT NOT NULL, email TEXT NOT NULL UNIQUE);
CREATE TABLE IF NOT EXISTS challenges (id TEXT PRIMARY KEY, player1Id TEXT NOT NULL, player2Id TEXT NOT NULL, date TEXT NOT NULL);
