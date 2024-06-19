import { Hono } from "hono";

import users from "./routes/users";
import proofs from "./routes/proofs";
import drops from "./routes/drops";
import tokens from "./routes/tokens";

import { createClient, reservoirChains } from "@reservoir0x/reservoir-sdk";

export type Env = {
  DATABASE_URL: string;
};

const app = new Hono<{ Bindings: Env }>();

const routes = app
  .route("/users", users)
  .route("/proofs", proofs)
  .route("/drops", drops)
  .route("/tokens", tokens);

createClient({
  apiKey: process.env.RESERVOIR_API_KEY!,
  chains: [
    {
      ...reservoirChains.sepolia,
      active: true,
    },
  ],
});

export type AppType = typeof routes;

export default {
  port: 7070,
  fetch: app.fetch,
};
