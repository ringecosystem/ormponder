import { createSchema } from "@ponder/core";

export default createSchema((p) => ({
  // === V2
  MessageAcceptedV2: p.createTable({
    id: p.string(),
    msgHash: p.string(),
    root: p.string(),
    message: p.string(),
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
    relayerFee: p.bigint()
  }),
  // === V1
  MessageAcceptedV1: p.createTable({
    id: p.string(),
    msgHash: p.string(),
    root: p.string(),
    message: p.string(),
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
