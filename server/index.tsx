import { Hono } from "hono";
import { cors } from "hono/cors";
import api from "./api";

const app = new Hono();
app.use("*", cors());

app.notFound((c) => c.json({ error: "Not found" }, 404));

app.route("/api", api);

export default app;
