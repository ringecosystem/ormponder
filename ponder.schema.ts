import { onchainTable } from "ponder";

// === msgport
export const MessageSent = onchainTable("MessageSent", (p) => ({
  id: p.text().primaryKey(),
  blockNumber: p.bigint().notNull(),
  blockTimestamp: p.bigint().notNull(),
  transactionHash: p.hex().notNull(),

  chainId: p.bigint().notNull(),
  msgId: p.hex().notNull(),
  fromDapp: p.hex().notNull(),
  toChainId: p.bigint().notNull(),
  toDapp: p.hex().notNull(),
  message: p.hex().notNull(),
  params: p.hex().notNull(),
}));

export const MessageReceived = onchainTable("MessageReceived", (p) => ({
  id: p.text().primaryKey(),
  blockNumber: p.bigint().notNull(),
  blockTimestamp: p.bigint().notNull(),
  transactionHash: p.hex().notNull(),

  chainId: p.bigint().notNull(),
  msgId: p.hex().notNull(),
  result: p.boolean().notNull(),
  returnData: p.hex().notNull(),
}));

// === ormp

export const MessageAcceptedV2 = onchainTable("MessageAcceptedV2", (p) => ({
  id: p.text().primaryKey(),
  blockNumber: p.bigint().notNull(),
  blockTimestamp: p.bigint().notNull(),
  transactionHash: p.hex().notNull(),

  logIndex: p.integer().notNull(),
  msgHash: p.hex().notNull(),
  // message struct
  messageChannel: p.hex().notNull(),
  messageIndex: p.bigint().notNull(),
  messageFromChainId: p.bigint().notNull(),
  messageFrom: p.hex().notNull(),
  messageToChainId: p.bigint().notNull(),
  messageTo: p.hex().notNull(),
  messageGasLimit: p.bigint().notNull(),
  messageEncoded: p.hex().notNull(),

  // extra
  oracle: p.hex(),
  oracleAssigned: p.boolean(),
  oracleAssignedFee: p.bigint(),
  oracleLogIndex: p.integer(),
  relayer: p.hex(),
  relayerAssigned: p.boolean(),
  relayerAssignedFee: p.bigint(),
  relayerLogIndex: p.integer(),
}));

export const MessageDispatchedV2 = onchainTable("MessageDispatchedV2", (p) => ({
  id: p.text().primaryKey(),
  targetChainId: p.bigint().notNull(),

  blockNumber: p.bigint().notNull(),
  blockTimestamp: p.bigint().notNull(),
  transactionHash: p.hex().notNull(),

  msgHash: p.hex().notNull(),
  dispatchResult: p.boolean().notNull(),
}));

export const MessageAssignedV2 = onchainTable("MessageAssignedV2", (p) => ({
  id: p.text().primaryKey(),
  blockNumber: p.bigint().notNull(),
  blockTimestamp: p.bigint().notNull(),
  transactionHash: p.hex().notNull(),

  msgHash: p.hex().notNull(),
  oracle: p.hex().notNull(),
  relayer: p.hex().notNull(),
  oracleFee: p.bigint().notNull(),
  relayerFee: p.bigint().notNull(),
}));

export const HashImportedV2 = onchainTable("HashImportedV2", (p) => ({
  id: p.text().primaryKey(),
  blockNumber: p.bigint().notNull(),
  blockTimestamp: p.bigint().notNull(),
  transactionHash: p.hex().notNull(),

  srcChainId: p.bigint().notNull(),
  channel: p.hex().notNull(),
  msgIndex: p.bigint().notNull(),
  targetChainId: p.bigint().notNull(),
  oracle: p.hex().notNull(),
  hash: p.hex().notNull(),
}));

export const SignatureSubmittion = onchainTable("SignatureSubmittion", (p) => ({
  id: p.text().primaryKey(),
  blockNumber: p.bigint().notNull(),
  blockTimestamp: p.bigint().notNull(),
  transactionHash: p.hex().notNull(),

  srcChainId: p.bigint().notNull(),

  channel: p.hex().notNull(),
  msgIndex: p.bigint().notNull(),
  signer: p.hex().notNull(),
  signature: p.hex().notNull(),
  data: p.hex().notNull(),
}));

