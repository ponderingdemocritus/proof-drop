import { z } from "zod";

export interface HerodotusQuery {
  destinationChainId: string;
  fee: string;
  blockNumber: string;
  contractAddress: string;
  slot: string;
  originChainId: string;
}

export const HerodotusQuerySchema = z.object({
  tokenId: z.string(),
});

export const ProveQuerySchema = z.object({
  user: z.string(),
  proofDropId: z.number(),
  herodotusQuery: HerodotusQuerySchema,
});

export const StatusSchema = z.object({
  queryId: z.string(),
});

export const UserQuerySchema = z.object({
  address: z.string(),
});

export const CreateProofDropSchema = z.object({
  name: z.string(),
  contractAddress: z.string(),
  selector: z.string(),
  blockNumber: z.number(),
  owner: z.string(),
  slot: z.number(),
  originChainId: z.number(),
  destinationChainId: z.string(),
});
