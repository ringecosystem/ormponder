import { ponder } from "@/generated";

ponder.on("ORMP:MessageAccepted", async ({ event, context }) => {
  const { MessageAccepted } = context.db;
  await MessageAccepted.create({
    id: event.log.id,
    data: {
      msgHash: event.args.msgHash,
      root: event.args.root,
    },
  });
});

ponder.on("ORMP:MessageDispatched", async ({ event, context }) => {
  const { MessageDispatched } = context.db;
  await MessageDispatched.create({
    id: event.log.id,
    data: {
      msgHash: event.args.msgHash,
      dispatchResult: event.args.dispatchResult,
    },
  });
});

ponder.on("ORMP:MessageAssigned", async ({ event, context }) => {
  const { MessageAssigned } = context.db;
  await MessageAssigned.create({
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
