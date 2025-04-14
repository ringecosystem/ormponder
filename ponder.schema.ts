import { createSchema } from "@ponder/core";

export default createSchema((p) => ({
  // === msgport
  MessageSent: p.createTable({
    id: p.string(),
    blockNumber: p.bigint(),
    blockTimestamp: p.bigint(),
    transactionHash: p.string(),

    chainId: p.bigint(),
    msgId: p.string(),
    fromDapp: p.string(),
    toChainId: p.bigint(),
    toDapp: p.string(),
    message: p.string(),
    params: p.string(),
  }),
  MessageReceived: p.createTable({
    id: p.string(),
    blockNumber: p.bigint(),
    blockTimestamp: p.bigint(),
    transactionHash: p.string(),

    chainId: p.bigint(),
    msgId: p.string(),
    result: p.boolean(),
    returnData: p.string(),
  }),
  // === V2
  MessageAcceptedV2: p.createTable({
    id: p.string(),

    blockNumber: p.bigint(),
    blockTimestamp: p.bigint(),
    transactionHash: p.string(),

    logIndex: p.int(),
    msgHash: p.string(),
    // message struct
    messageChannel: p.string(),
    messageIndex: p.bigint(),
    messageFromChainId: p.bigint(),
    messageFrom: p.string(),
    messageToChainId: p.bigint(),
    messageTo: p.string(),
    messageGasLimit: p.bigint(),
    messageEncoded: p.string(),
    // extra
    oracle: p.hex().optional(),
    oracleAssigned: p.boolean().optional(),
    oracleAssignedFee: p.bigint().optional(),
    oracleLogIndex: p.int().optional(),
    relayer: p.hex().optional(),
    relayerAssigned: p.boolean().optional(),
    relayerAssignedFee: p.bigint().optional(),
    relayerLogIndex: p.int().optional(),
  }),
  MessageDispatchedV2: p.createTable({
    id: p.string(),
    targetChainId: p.bigint(),

    blockNumber: p.bigint(),
    blockTimestamp: p.bigint(),
    transactionHash: p.string(),

    msgHash: p.string(),
    dispatchResult: p.boolean(),
  }),
  MessageAssignedV2: p.createTable({
    id: p.string(),

    blockNumber: p.bigint(),
    blockTimestamp: p.bigint(),
    transactionHash: p.string(),

    msgHash: p.string(),
    oracle: p.hex(),
    relayer: p.hex(),
    oracleFee: p.bigint(),
    relayerFee: p.bigint(),
  }),
  HashImportedV2: p.createTable({
    id: p.string(),

    blockNumber: p.bigint(),
    blockTimestamp: p.bigint(),
    transactionHash: p.string(),

    srcChainId: p.bigint(),
    channel: p.hex(),
    msgIndex: p.bigint(),
    targetChainId: p.bigint(),
    oracle: p.hex(),
    hash: p.string(),
  }),
  SignatureSubmittion: p.createTable({
    id: p.string(),

    blockNumber: p.bigint(),
    blockTimestamp: p.bigint(),
    transactionHash: p.string(),

    srcChainId: p.bigint(),

    channel: p.hex(),
    msgIndex: p.bigint(),
    signer: p.hex(),
    signature: p.string(),
    data: p.string(),
  }),
}));
