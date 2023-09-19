import { Link } from "wouter";
import { trpc } from "../trpc";
import { useAuth } from "../App";

export function Home() {
  const utils = trpc.useContext();
  const challenges = trpc.challenge.challenges.useQuery();
  const players = trpc.player.players.useQuery();
  const today = new Date().toISOString().split("T")[0];
  const tc = trpc.challenge.challengeByDate.useQuery({ date: today });
  const me = trpc.auth.me.useQuery();

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between flex-col-reverse gap-8 md:flex-row">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">Challenge me!</h1>
          <p className="mt-1">
            Get assigned a random challenger, and compete for victory!
          </p>
        </div>

        <div className="flex space-x-2 items-center self-end md:self-start">
          {me.data ? (
            <>
              <p className="p-2">Hello {me.data.name}</p>
              <button
                onClick={() => {
                  useAuth.getState().setToken(null);
                  utils.auth.me.invalidate();
                  me.refetch();
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login">
                <a className="button">Login</a>
              </Link>
              <Link href="/signup">
                <a className="button primary">Sign Up</a>
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="mt-16 w-full border border-stone-300 px-4 md:px-8 py-4 md:py-6 bg-white rounded-xl">
        <h2 className="font-bold text-center">{"Today's Challenge"}</h2>
        <p className="text-center text-sm">{today}</p>
        {tc.data ? (
          <div className="flex justify-center gap-4 mt-4 text-3xl md:text-4xl text-center font-bold mb-2">
            <p title={tc.data.player1.email}>{tc.data.player1.name}</p>
            <p>v</p>
            <p title={tc.data.player2.email}>{tc.data.player2.name}</p>
          </div>
        ) : (
          <p className="text-3xl md:text-4xl font-bold text-center mt-4 mb-2 text-stone-300">
            No challenge today (yet)
          </p>
        )}
      </div>

      <div className="mt-16">
        <h2 className="text-xl font-bold">Players</h2>
        <ul className="mt-2">
          {players.data?.length === 0 && <li>No players yet</li>}
          {players.data?.map((p: any) => (
            <li key={p.id}>
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
            <li key={c.id}>
              {c.date} - {c.player1.name} v {c.player2.name}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
