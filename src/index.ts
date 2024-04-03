import { ponder } from "@/generated";

ponder.on("ORMPV2:MessageAccepted", async ({ event, context }) => {
  const { MessageAcceptedV2 } = context.db;
  const message = event.args.message;
  await MessageAcceptedV2.create({
    id: event.log.id,
    data: {
      logIndex: event.log.logIndex,
      msgHash: event.args.msgHash,
      root: `${event.args.root}`,
      messageChannel: message.channel,
      messageIndex: message.index,
      messageFromChainId: message.fromChainId,
      messageFrom: message.from,
      messageToChainId: message.toChainId,
      messageTo: message.to,
      messageGasLimit: message.gasLimit,
      messageEncoded: message.encoded,
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
  const { MessageAssignedV2, MessageAcceptedV2 } = context.db;
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
  // filter other relayer
  if (
    !["0xb773319D6Eb7f34b8EAB26Ea5F5ea694E7EF6362"].includes(event.args.relayer)
  ) {
    await MessageAcceptedV2.updateMany({
      where: {
        msgHash: {
          equals: event.args.msgHash,
        },
      },
      data: {
        oracleAssigned: true,
        oracleAssignedFee: event.args.relayerFee,
        oracleLogIndex: event.log.logIndex,
      },
    });
  }
  // filter other oracle
  if (
    !["0xDD8c7c84DaCBbB60F1CfC4f10046245da1E0f33D"].includes(event.args.oracle)
  ) {
    await MessageAcceptedV2.updateMany({
      where: {},
      data: {
        relayerAssigned: true,
        relayerAssignedFee: event.args.oracleFee,
        relayerLogIndex: event.log.logIndex,
      },
    });
  }
});

ponder.on("SignaturePub:SignatureSubmittion", async ({ event, context }) => {
  const { SignatureSubmittion } = context.db;
  await SignatureSubmittion.create({
    id: event.log.id,
    data: {
      chainId: event.args.chainId,
      msgIndex: event.args.msgIndex,
      signer: event.args.signer,
      signature: event.args.signature,
      data: event.args.data,
    },
  });
});

// V1
ponder.on("ORMPV1:MessageAccepted", async ({ event, context }) => {
  const { MessageAcceptedV1 } = context.db;
  const message = event.args.message;
  await MessageAcceptedV1.create({
    id: event.log.id,
    data: {
      msgHash: event.args.msgHash,
      root: `${event.args.root}`,
      messageChannel: message.channel,
      messageIndex: message.index,
      messageFromChainId: message.fromChainId,
      messageFrom: message.from,
      messageToChainId: message.toChainId,
      messageTo: message.to,
      messageGasLimit: message.gasLimit,
      messageEncoded: message.encoded,
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
