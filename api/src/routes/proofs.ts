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

function chunkArray(array: any, chunkSize: any) {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

const app = new Hono<{ Bindings: Env }>()
  .post("/create", zValidator("json", ProveQuerySchema), async (c) => {
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
      .where(eq(proofDrops.proofDropId, data.proofDropId))
      .limit(1);

    if (existingProofDrop.length == 0) {
      return c.json({ success: false, message: "Proof drop not found" }, 409);
    }

    const proofDrop = existingProofDrop[0];

    const slots = [];
    for (let i = 0; i <= proofDrop.numberTokens; i++) {
      const tokenIdSlot = solidityPackedKeccak256(
        ["string", "uint256"],
        [i.toString(), proofDrop.slot]
      );
      slots.push(tokenIdSlot);
    }

    const slotBatches = chunkArray(slots, 50);

    for (const batch of slotBatches) {
      const herodotusQuery = {
        destinationChainId: proofDrop.destinationChainId,
        fee: "0", // todo: currently free
        data: {
          [`${proofDrop.originChainId}`]: {
            [`block:${proofDrop.blockNumber}`]: {
              accounts: {
                [`${proofDrop.contractAddress}`]: {
                  slots: batch,
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

      console.log(herodotusQueryId);

      const result = await db
        .insert(claims)
        .values({
          requestedJobId: herodotusQueryId,
          userId: existingUser[0].id,
          tokenId: data.herodotusQuery.tokenId,
          proofDropId: proofDrop.proofDropId,
          status: "submitted",
        })
        .returning({ created_at: claims.createdAt });
    }

    return c.json({
      success: true,
      message: `Query submitted with id`,
      claim: "complete",
    });
  })
  .get("/status", async (c) => {
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
