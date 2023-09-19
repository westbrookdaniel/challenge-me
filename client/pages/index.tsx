import { Link } from "wouter";
import { trpc } from "../trpc";
import { useAuth } from "../main";

export function Home() {
  const utils = trpc.useContext();
  const challenges = trpc.challenge.challenges.useQuery();
  const players = trpc.player.players.useQuery();
  const tc = trpc.challenge.challengeByDate.useQuery({
    date: new Date().toISOString().split("T")[0],
  });
  const me = trpc.auth.me.useQuery();

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Challenge me!</h1>
      <p className="mt-2">
        Get assigned a random challenger, and compete for victory!
      </p>

      <div className="flex space-x-2 items-center mt-4">
        {me.data ? (
          <>
            <button
              onClick={() => {
                useAuth.getState().setToken(null);
                utils.auth.me.invalidate();
                me.refetch();
              }}
            >
              Logout
            </button>
            <p className="p-2">Hello {me.data.name}</p>
          </>
        ) : (
          <>
            <Link href="/login">
              <a className="button">Login</a>
            </Link>
            <Link href="/signup">
              <a className="button">Sign Up</a>
            </Link>
          </>
        )}
      </div>

      <div className="mt-16">
        <h2 className="text-4xl font-bold">Todays Challenge</h2>
        {tc.data ? (
          <p className="mt-4">
            {tc.data.date} - {tc.data.player1.name} v {tc.data.player2.name}
          </p>
        ) : (
          <p className="mt-4">No challenge today</p>
        )}
      </div>

      <div className="mt-16">
        <h2 className="text-xl font-bold">Players</h2>
        <ul className="mt-2">
          {players.data?.length === 0 && <li>No players yet</li>}
          {players.data?.map((p: any) => (
            <li>
              {p.name} ({p.email})
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold">Past Challenges</h2>
        <ul className="mt-2">
          {challenges.data?.length === 0 && <li>No challenges yet</li>}
          {challenges.data?.map((c: any) => (
            <li>
              {c.date} - {c.player1.name} v {c.player2.name}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
