import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { Route, Router } from "wouter";
import { Login } from "./pages/login";
import { trpc } from "./trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { create } from "zustand";
import { Signup } from "./pages/signup";
import { persist } from "zustand/middleware";
import { Home } from "./pages";

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

function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "http://localhost:3000",
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
        <Router>
          <Route path="/">
            <Home />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/signup">
            <Signup />
          </Route>
        </Router>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
