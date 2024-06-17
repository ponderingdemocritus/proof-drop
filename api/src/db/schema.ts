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
  created_at: timestamp("created_at").defaultNow(),
});

export const claims = pgTable("claims", {
  id: serial("id").primaryKey(),
  requested_job_id: text("requested_job_id"),
  proof_drop_id: integer("proof_drop_id").references(
    () => proofDrops.proof_drop_id
  ),
  user_id: integer("user_id").references(() => users.id),
  token_id: text("token_id"),
  created_at: timestamp("created_at").defaultNow(),
  status: text("status"),
});

export const proofDrops = pgTable("proof_drops", {
  proof_drop_id: serial("proof_drop_id").primaryKey(),
  name: text("name"),
  contract_address: text("contract_address"),
  selector: text("selector"),
  block_number: integer("block_number"),
  owner_id: integer("owner_id").references(() => users.id),
  slot: integer("slot"), // Storage slot to base proof on
  origin_chain_id: integer("origin_chain_id"), // Ethereum
  destination_chain_id: text("destination_chain_id"), // SN_SEPOLIA
  created_at: timestamp("created_at").defaultNow(),
});

// collections verified

export const erc721Collection = pgTable("erc_721_collection", {
  id: serial("id").primaryKey(),
  name: text("name"),
  contract_address: text("contract_address"),
  block_number: integer("block_number"),
  slot: integer("slot"), // Storage slot to base proof on
  number_tokens: integer("number_tokens"),
  owner_id: integer("owner_id").references(() => users.id),
  chain_id: integer("chain_id"), // Ethereum
  verified: boolean("verified"),
  created_at: timestamp("created_at").defaultNow(),
});
