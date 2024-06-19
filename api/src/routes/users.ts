import { Hono } from "hono";
import { drizzle } from "drizzle-orm/neon-http";
import { zValidator } from "@hono/zod-validator";
import { neon } from "@neondatabase/serverless";
import { UserQuerySchema } from "../types";
import { claims, users } from "../db/schema";
import { eq } from "drizzle-orm";

const app = new Hono()
  .get("/", async (c) => {
    const address = c.req.query("address");

    if (!address) {
      return c.json({ success: false, message: "Address is required" }, 400);
    }

    const sql = neon(process.env.DATABASE_URL!);
    const db = drizzle(sql);
    const result = await db
      .select()
      .from(users)
      .where(eq(users.address, address))
      .limit(1);

    if (result.length === 0) {
      return c.json({ success: false, message: "User not found" }, 404);
    }

    return c.json({ success: true, user: result[0] });
  })
  .get("/proofs", async (c) => {
    const address = c.req.query("address");

    if (!address) {
      return c.json({ success: false, message: "Address is required" }, 400);
    }

    const sql = neon(process.env.DATABASE_URL!);
    const db = drizzle(sql);
    const result = await db
      .select()
      .from(users)
      .where(eq(users.address, address))
      .limit(1);

    if (result.length === 0) {
      return c.json({ success: false, message: "User not found" }, 404);
    }

    const user = result[0];

    const proofs = await db
      .select()
      .from(claims)
      .where(eq(claims.userId, user.id));

    return c.json({ success: true, proofs });
  })
  .post("/create", zValidator("json", UserQuerySchema), async (c) => {
    const data = c.req.valid("json");

    if (!data.address) {
      return c.json({ success: false, message: "Address is required" }, 400);
    }

    const sql = neon(process.env.DATABASE_URL!);
    const db = drizzle(sql);

    // Check if the user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.address, data.address))
      .limit(1);

    if (existingUser.length > 0) {
      return c.json({ success: false, message: "User already exists" }, 409);
    }

    // Insert new user if not exists
    const result = await db
      .insert(users)
      .values({ address: data.address })
      .returning({ created_at: users.createdAt });

    return c.json({ success: true, user: result[0] });
  });

export default app;
