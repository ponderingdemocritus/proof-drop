import { Hono } from "hono";

import users from "./routes/users";
import proofs from "./routes/proofs";
import drops from "./routes/drops";

export type Env = {
  DATABASE_URL: string;
};

const app = new Hono<{ Bindings: Env }>();

app.route("/users", users);

app.route("/proofs", proofs);

app.route("/drops", drops);

export default {
  port: 7070,
  fetch: app.fetch,
};
