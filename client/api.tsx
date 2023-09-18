import { edenTreaty } from "@elysiajs/eden";
import type { App } from "../server";

const app = edenTreaty<App>("http://localhost:3000");

const foo = app.api.get();
