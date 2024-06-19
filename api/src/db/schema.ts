import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  boolean,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  address: text("address"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const claims = pgTable("claims", {
  id: serial("id").primaryKey(),
  requestedJobId: text("requested_job_id"),
  proofDropId: integer("proof_drop_id").references(
    () => proofDrops.proofDropId
  ),
  userId: integer("user_id").references(() => users.id),
  tokenId: text("token_id"),
  createdAt: timestamp("created_at").defaultNow(),
  status: text("status"),
});

export const proofDrops = pgTable("proof_drops", {
  proofDropId: serial("proof_drop_id").primaryKey(),
  name: text("name").notNull(),
  contractAddress: text("contract_address").notNull(),
  selector: text("selector").notNull(),
  blockNumber: integer("block_number").notNull(),
  numberTokens: integer("number_tokens").notNull(),
  ownerId: integer("owner_id")
    .references(() => users.id)
    .notNull(),
  slot: integer("slot").notNull(), // Storage slot to base proof on
  originChainId: integer("origin_chain_id").notNull(), // Ethereum
  destinationChainId: text("destination_chain_id").notNull(), // SN_SEPOLIA
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
