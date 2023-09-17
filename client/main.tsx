import React from "react";
import ReactDOM from "react-dom/client";
import { Route, Router } from "wouter";
import { Home } from "./pages";
import { Login } from "./pages/login";

function App() {
  return (
    <Router>
      <Route path="/">
        <Home />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
    </Router>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
