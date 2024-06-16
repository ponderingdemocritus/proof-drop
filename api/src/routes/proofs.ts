import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { ProveQuerySchema } from "../types";
import { solidityPackedKeccak256 } from "ethers";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { claims, proofDrops, users } from "../db/schema";
import { eq } from "drizzle-orm";

export type Env = {
  DATABASE_URL: string;
};

const app = new Hono<{ Bindings: Env }>();

app.post("/create", zValidator("json", ProveQuerySchema), async (c) => {
  const data = c.req.valid("json");

  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql);

  // Check if the user already exists
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.address, data.user))
    .limit(1);

  if (existingUser.length == 0) {
    return c.json(
      { success: false, message: "Create an account to submit proofs" },
      409
    );
  }

  // check drop exists
  const existingProofDrop = await db
    .select()
    .from(proofDrops)
    .where(eq(proofDrops.proof_drop_id, data.proofDropId))
    .limit(1);

  if (existingProofDrop.length == 0) {
    return c.json({ success: false, message: "Proof drop not found" }, 409);
  }

  const proofDrop = existingProofDrop[0];

  // generate the slots
  const tokenIdSlot = solidityPackedKeccak256(
    ["string", "uint256"],
    [data.herodotusQuery.tokenId, proofDrop.slot]
  );

  const addressSlot = "0x" + (BigInt(tokenIdSlot) + BigInt(1)).toString(16);

  const herodotusQuery = {
    destinationChainId: proofDrop.destination_chain_id,
    fee: "0", // todo: currently free
    data: {
      [`${proofDrop.origin_chain_id}`]: {
        [`block:${proofDrop.block_number}`]: {
          accounts: {
            [`${proofDrop.contract_address}`]: {
              slots: [tokenIdSlot, addressSlot],
            },
          },
        },
      },
    },
  };

  const request = new Request(
    `https://api.herodotus.cloud/submit-batch-query?apiKey=${process.env.HERODOTUS_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(herodotusQuery),
    }
  );

  const response = await fetch(request);

  const { internalId: herodotusQueryId } = await response.json();

  const result = await db
    .insert(claims)
    .values({
      requested_job_id: herodotusQueryId,
      user_id: existingUser[0].id,
      token_id: data.herodotusQuery.tokenId,
      proof_drop_id: proofDrop.proof_drop_id,
      status: "submitted",
    })
    .returning({ created_at: claims.created_at });

  return c.json({
    success: true,
    message: `Query submitted with id ${herodotusQueryId}`,
    claim: result[0],
  });
});

app.get("/status", async (c) => {
  const queryId = c.req.query("queryId");

  const request = new Request(
    `https://api.herodotus.cloud/batch-query-status?batchQueryId=${queryId}&apiKey=${process.env.HERODOTUS_API_KEY}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const response = await fetch(request);
  const { queryStatus } = await response.json();

  return c.json({ status: queryStatus });
});

export default app;
