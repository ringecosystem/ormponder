import { createSchema } from "@ponder/core";

export default createSchema((p) => ({
  MessageAccepted: p.createTable({
    id: p.string(),
    msgHash: p.string(),
    root: p.string(),
  }),
  MessageDispatched: p.createTable({
    id: p.string(),
    msgHash: p.string(),
    dispatchResult: p.boolean(),
  }),
  MessageAssigned: p.createTable({
    id: p.string(),
    msgHash: p.string(),
    oracle: p.hex(),
    relayer: p.hex(),
    oracleFee: p.bigint(),
    relayerFee: p.bigint()
  }),
}));
