import { Hono } from "hono";
import { drizzle } from "drizzle-orm/neon-http";
import { zValidator } from "@hono/zod-validator";
import { neon } from "@neondatabase/serverless";
import { CreateProofDropSchema } from "../types";
import { proofDrops, users } from "../db/schema";
import { eq } from "drizzle-orm";

const app = new Hono();

app.post("/create", zValidator("json", CreateProofDropSchema), async (c) => {
  const data = c.req.valid("json");

  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql);

  // Check if the user already exists
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.address, data.owner))
    .limit(1);

  if (existingUser.length == 0) {
    return c.json({ success: false, message: "User not found" }, 409);
  }

  // Create a new proof drop
  const result = await db
    .insert(proofDrops)
    .values({
      name: data.name,
      contract_address: data.contractAddress,
      selector: data.selector,
      block_number: data.blockNumber,
      owner_id: existingUser[0].id,
      slot: data.slot,
      origin_chain_id: data.originChainId,
      destination_chain_id: data.destinationChainId,
    })
    .returning({ created_at: users.created_at });

  return c.json({ success: true, user: result[0] });
});

// get all drops

app.get("/", async (c) => {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql);
  const result = await db.select().from(proofDrops);

  return c.json({ success: true, drops: result });
});

export default app;
