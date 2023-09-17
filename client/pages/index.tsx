export function Home() {
  const players: any[] = [];
  const challenges: any[] = [];
  const today = new Date().toISOString().split("T")[0];
  const tc: any = null;
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Challenge me!</h1>
      <p className="mt-2">
        Get assigned a random challenger, and compete for victory!
      </p>

      <div className="flex space-x-2 mt-4">
        <button aria-disabled="true">Login</button>
        <button aria-disabled="true">Sign Up</button>
      </div>

      <div className="mt-16">
        <h2 className="text-4xl font-bold">Todays Challenge</h2>
        {tc ? (
          <p className="mt-4">
            {tc.date} - {tc.player1.name} v {tc.player2.name}
          </p>
        ) : (
          <p className="mt-4">No challenge today</p>
        )}
      </div>

      <div className="mt-16">
        <h2 className="text-xl font-bold">Players</h2>
        <ul className="mt-2">
          {players.length === 0 && <li>No players yet</li>}
          {players.map((p) => (
            <li>
              {p.name} ({p.email})
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold">Past Challenges</h2>
        <ul className="mt-2">
          {challenges.length === 0 && <li>No challenges yet</li>}
          {challenges.map((c) => (
            <li>
              {c.date} - {c.player1.name} v {c.player2.name}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
