import { ponder } from "@/generated";

ponder.on("ORMPV2:MessageAccepted", async ({ event, context }) => {
  const { MessageAcceptedV2 } = context.db;
  await MessageAcceptedV2.create({
    id: event.log.id,
    data: {
      msgHash: event.args.msgHash,
      root: event.args.root,
      message: JSON.stringify(event.args.message),
    },
  });
});

ponder.on("ORMPV2:MessageDispatched", async ({ event, context }) => {
  const { MessageDispatchedV2 } = context.db;
  await MessageDispatchedV2.create({
    id: event.log.id,
    data: {
      msgHash: event.args.msgHash,
      dispatchResult: event.args.dispatchResult,
    },
  });
});

ponder.on("ORMPV2:MessageAssigned", async ({ event, context }) => {
  const { MessageAssignedV2 } = context.db;
  await MessageAssignedV2.create({
    id: event.log.id,
    data: {
      msgHash: event.args.msgHash,
      oracle: event.args.oracle,
      relayer: event.args.relayer,
      oracleFee: event.args.oracleFee,
      relayerFee: event.args.relayerFee,
    },
  });
});

ponder.on("ORMPV1:MessageAccepted", async ({ event, context }) => {
  const { MessageAcceptedV1 } = context.db;
  await MessageAcceptedV1.create({
    id: event.log.id,
    data: {
      msgHash: event.args.msgHash,
      root: event.args.root,
      message: JSON.stringify(event.args.message),
    },
  });
});

ponder.on("ORMPV1:MessageDispatched", async ({ event, context }) => {
  const { MessageDispatchedV1 } = context.db;
  await MessageDispatchedV1.create({
    id: event.log.id,
    data: {
      msgHash: event.args.msgHash,
      dispatchResult: event.args.dispatchResult,
    },
  });
});

ponder.on("ORMPOracleV1:Assigned", async ({ event, context }) => {
  const { OracleAssignedV1 } = context.db;
  await OracleAssignedV1.create({
    id: event.log.id,
    data: {
      msgHash: event.args.msgHash,
      fee: event.args.fee,
    },
  });
});

ponder.on("ORMPRelayerV1:Assigned", async ({ event, context }) => {
  const { RelayerAssignedV1 } = context.db;
  await RelayerAssignedV1.create({
    id: event.log.id,
    data: {
      msgHash: event.args.msgHash,
      fee: event.args.fee,
      params: event.args.params,
      proof: JSON.stringify(event.args.proof),
    },
  });
});
