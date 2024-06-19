import { Hono } from "hono";

import { paths } from "@reservoir0x/reservoir-sdk";

const app = new Hono().get("/erc721/user", async (c) => {
  const { collection, user } = c.req.query();

  const res = await fetch(
    `https://api-sepolia.reservoir.tools/users/${user}/tokens/v10?collection=${collection}`
  );
  const data = await res.json();

  const response =
    data as paths["/users/{user}/tokens/v10"]["get"]["responses"]["200"]["schema"];

  return c.json({ success: true, tokens: response.tokens });
});

export default app;
