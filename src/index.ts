import { ponder } from "@/generated";

const listenRelayer = [
  "0xaC2b224c2E1eD2E8663097a361A05a72d6671C7D",
  "0x0EEf3478C2E34c36Bb13B8B235096D5c361873bF", // tron
];
const listenOracle = [
  "0x3f938756ceFa33665719Eb528E581FF3f460b7C6",
  "0x58facC3a63CEF6d806E08d9189B37351dd4aE9C3", // tron
];
const listenSignature = [
  "0xA72d283015c01807bc0788Bf22C1A774bDbFC8fA",
  "0x13c991C5BEf30c0E8600D95B8554B4DeDa4853b8", // tron
];

ponder.on("ORMPV2:MessageAccepted", async ({ event, context }) => {
  const { MessageAcceptedV2 } = context.db;
  const message = event.args.message;
  await MessageAcceptedV2.create({
    id: `${context.network.chainId}-${event.block.number}-${event.log.transactionIndex}-${event.log.logIndex}`,
    data: {
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,

      logIndex: event.log.logIndex,
      msgHash: event.args.msgHash,
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
    id: `${context.network.chainId}-${event.block.number}-${event.log.transactionIndex}-${event.log.logIndex}`,
    data: {
      targetChainId: BigInt(context.network.chainId),
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,

      msgHash: event.args.msgHash,
      dispatchResult: event.args.dispatchResult,
    },
  });
});

ponder.on("ORMPV2:MessageAssigned", async ({ event, context }) => {
  const { MessageAssignedV2, MessageAcceptedV2 } = context.db;
  await MessageAssignedV2.create({
    id: `${context.network.chainId}-${event.block.number}-${event.log.transactionIndex}-${event.log.logIndex}`,
    data: {
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,

      msgHash: event.args.msgHash,
      oracle: event.args.oracle,
      relayer: event.args.relayer,
      oracleFee: event.args.oracleFee,
      relayerFee: event.args.relayerFee,
    },
  });
  // console.log(
  //   event.args.relayer,
  //   listenRelayer.includes(event.args.relayer),
  //   context.network.name
  // );
  // filter other relayer
  if (listenRelayer.includes(event.args.relayer)) {
    await MessageAcceptedV2.updateMany({
      where: {
        msgHash: {
          equals: event.args.msgHash,
        },
      },
      data: {
        relayer: event.args.relayer,
        relayerAssigned: true,
        relayerAssignedFee: event.args.relayerFee,
        relayerLogIndex: event.log.logIndex,
      },
    });
  }
  // console.log(
  //   event.args.oracle,
  //   listenRelayer.includes(event.args.oracle),
  //   context.network.name
  // );
  // filter other oracle
  if (listenOracle.includes(event.args.oracle)) {
    await MessageAcceptedV2.updateMany({
      where: {
        msgHash: {
          equals: event.args.msgHash,
        },
      },
      data: {
        oracle: event.args.oracle,
        oracleAssigned: true,
        oracleAssignedFee: event.args.oracleFee,
        oracleLogIndex: event.log.logIndex,
      },
    });
  }
});

ponder.on("ORMPV2:HashImported", async ({ event, context }) => {
  const { HashImportedV2 } = context.db;
  // filter other oracle
  if (listenOracle.includes(event.args.oracle)) {
    await HashImportedV2.create({
      id: `${context.network.chainId}-${event.block.number}-${event.log.transactionIndex}-${event.log.logIndex}`,
      data: {
        blockNumber: event.block.number,
        blockTimestamp: event.block.timestamp,
        transactionHash: event.transaction.hash,
        srcChainId: event.args.chainId,
        channel: event.args.channel,
        msgIndex: event.args.msgIndex,
        targetChainId: BigInt(context.network.chainId),
        oracle: event.args.oracle,
        hash: event.args.hash,
      },
    });
  }
});

ponder.on("SignaturePub:SignatureSubmittion", async ({ event, context }) => {
  const { SignatureSubmittion } = context.db;
  // filter other channels
  if (listenSignature.includes(event.args.channel)) {
    await SignatureSubmittion.create({
      id: `${context.network.chainId}-${event.block.number}-${event.log.transactionIndex}-${event.log.logIndex}`,
      data: {
        blockNumber: event.block.number,
        blockTimestamp: event.block.timestamp,
        transactionHash: event.transaction.hash,

        srcChainId: event.args.chainId,
        channel: event.args.channel,
        msgIndex: event.args.msgIndex,
        signer: event.args.signer,
        signature: event.args.signature,
        data: event.args.data,
      },
    });
  }
});
