import { createSchema } from "@ponder/core";

export default createSchema((p) => ({
  // === V2
  MessageAcceptedV2: p.createTable({
    id: p.string(),
    logIndex: p.int(),
    msgHash: p.string(),
    root: p.string(),
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
    oracleAssigned: p.boolean().optional(),
    oracleAssignedFee: p.bigint().optional(),
    oracleLogIndex: p.int().optional(),
    relayerAssigned: p.boolean().optional(),
    relayerAssignedFee: p.bigint().optional(),
    relayerLogIndex: p.int().optional(),
  }),
  MessageDispatchedV2: p.createTable({
    id: p.string(),
    msgHash: p.string(),
    dispatchResult: p.boolean(),
  }),
  MessageAssignedV2: p.createTable({
    id: p.string(),
    msgHash: p.string(),
    oracle: p.hex(),
    relayer: p.hex(),
    oracleFee: p.bigint(),
    relayerFee: p.bigint(),
  }),
  SignatureSubmittion: p.createTable({
    id: p.string(),
    chainId: p.bigint(),
    msgIndex: p.bigint(),
    signer: p.string(),
    signature: p.string(),
    data: p.string(),
  }),
  // === V1
  MessageAcceptedV1: p.createTable({
    id: p.string(),
    msgHash: p.string(),
    root: p.string(),
    // message struct
    messageChannel: p.string(),
    messageIndex: p.bigint(),
    messageFromChainId: p.bigint(),
    messageFrom: p.string(),
    messageToChainId: p.bigint(),
    messageTo: p.string(),
    messageGasLimit: p.bigint(),
    messageEncoded: p.string(),
  }),
  MessageDispatchedV1: p.createTable({
    id: p.string(),
    msgHash: p.string(),
    dispatchResult: p.boolean(),
  }),
  OracleAssignedV1: p.createTable({
    id: p.string(),
    msgHash: p.string(),
    fee: p.bigint(),
  }),
  RelayerAssignedV1: p.createTable({
    id: p.string(),
    msgHash: p.string(),
    fee: p.bigint(),
    params: p.string(),
    proof: p.string(),
  }),
}));
