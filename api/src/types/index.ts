import { z } from "zod";

// Common schemas
const stringField = z.string();
const numberField = z.number();

// HerodotusQuery interface
export interface HerodotusQuery {
  destinationChainId: string;
  fee: string;
  blockNumber: string;
  contractAddress: string;
  slot: string;
  originChainId: string;
}

// Schemas
export const HerodotusQuerySchema = z.object({
  tokenId: stringField,
});

export const ProveQuerySchema = z.object({
  user: stringField,
  proofDropId: numberField,
  herodotusQuery: HerodotusQuerySchema,
});

export const StatusSchema = z.object({
  queryId: stringField,
});

export const UserQuerySchema = z.object({
  address: stringField,
});

export const CreateProofDropSchema = z.object({
  name: stringField,
  contractAddress: stringField,
  selector: stringField,
  blockNumber: numberField,
  owner: stringField,
  slot: numberField,
  originChainId: numberField,
  destinationChainId: stringField,
});

export const CreateERC721CollectionSchema = z.object({
  name: stringField,
  contractAddress: stringField,
  blockNumber: numberField,
  slot: numberField,
  numberTokens: numberField,
  owner: stringField,
  chainId: numberField,
  verified: z.boolean(),
});
