import { ponder } from "@/generated";
import axios from "axios";
import cron from "node-cron";

// health check
cron.schedule("*/3 * * * *", async () => {
  await axios.get("https://hc-ping.com/5B4xQyjO7c1ReOiZiaS4yQ/ormponder");
});

const listenRelayer = [
  "0xb773319D6Eb7f34b8EAB26Ea5F5ea694E7EF6362",
];
const listenOracle = [
  "0xDD8c7c84DaCBbB60F1CfC4f10046245da1E0f33D",
  "0x0f14341A7f464320319025540E8Fe48Ad0fe5aec",
];

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
      id: event.log.id,
      data: {
        srcChainId: event.args.srcChainId,
        oracle: event.args.oracle,
        lookupKey: event.args.lookupKey,
        hash: event.args.hash,
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
