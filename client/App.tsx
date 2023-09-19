import { useState } from "react";
import { Link, Route, Router, Switch } from "wouter";
import { Login } from "./pages/login";
import { trpc } from "./trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { create } from "zustand";
import { Signup } from "./pages/signup";
import { persist } from "zustand/middleware";
import { Home } from "./pages";
import { Challenge } from "./pages/challenge";

const defaultUrl = `https://${window.location.hostname}/trpc`;
const url = import.meta.env.VITE_APP_API_URL || defaultUrl;

type AuthStore = {
  token: string | null;
  setToken: (token: string | null) => void;
};

export const useAuth = create(
  persist<AuthStore>(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
    }),
    { name: "auth-storage" },
  ),
);

export function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url,
          // You can pass any HTTP headers you wish here
          async headers() {
            const token = useAuth.getState().token;
            if (!token) return {};
            return { authorization: `Bearer ${token}` };
          },
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <div className="bg-stone-100 min-h-screen">
          <Router>
            <Switch>
              <Route path="/">
                <Home />
              </Route>
              <Route path="/login">
                <Login />
              </Route>
              <Route path="/signup">
                <Signup />
              </Route>
              <Route path="/challenge/:id">
                {(params) => <Challenge id={params.id} />}
              </Route>
              <Route>
                <main className="max-w-4xl mx-auto px-4 pb-8 pt-16">
                  <h1 className="text-2xl font-bold">Not Found</h1>
                  <div className="flex flex-start">
                    <Link href="/">
                      <a className="button mt-4">Home</a>
                    </Link>
                  </div>
                </main>
              </Route>
            </Switch>
          </Router>
        </div>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
