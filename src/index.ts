import { ponder } from "ponder:registry";
import {
  MessageSent,
  MessageReceived,
  MessageAcceptedV2,
  MessageDispatchedV2,
  MessageAssignedV2,
  HashImportedV2,
  SignatureSubmittion,
} from "ponder:schema";

import * as address from "./address.local";

ponder.on("Msgport:MessageSent", async ({ event, context }) => {
  await context.db
    .insert(MessageSent)
    .values({
      id: `${context.network.chainId}-${event.block.number}-${event.transaction.transactionIndex}-${event.log.logIndex}`,
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,

      chainId: BigInt(context.network.chainId),
      msgId: event.args.msgId,
      fromDapp: event.args.fromDapp,
      toChainId: event.args.toChainId,
      toDapp: event.args.toDapp,
      message: event.args.message,
      params: event.args.params,
    })
    .onConflictDoNothing();
});

ponder.on("Msgport:MessageRecv", async ({ event, context }) => {
  await context.db
    .insert(MessageReceived)
    .values({
      id: `${context.network.chainId}-${event.block.number}-${event.transaction.transactionIndex}-${event.log.logIndex}`,

      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,

      chainId: BigInt(context.network.chainId),
      msgId: event.args.msgId,
      result: event.args.result,
      returnData: event.args.returnData,
    })
    .onConflictDoNothing();
});

ponder.on("ORMPV2:MessageAccepted", async ({ event, context }) => {
  const message = event.args.message;
  await context.db
    .insert(MessageAcceptedV2)
    .values({
      id: event.args.msgHash,
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
    })
    .onConflictDoUpdate((row) => ({
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
    }));
});

ponder.on("ORMPV2:MessageDispatched", async ({ event, context }) => {
  await context.db
    .insert(MessageDispatchedV2)
    .values({
      id: `${context.network.chainId}-${event.block.number}-${event.transaction.transactionIndex}-${event.log.logIndex}`,
      targetChainId: BigInt(context.network.chainId),
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,

      msgHash: event.args.msgHash,
      dispatchResult: event.args.dispatchResult,
    })
    .onConflictDoNothing();
});

ponder.on("ORMPV2:MessageAssigned", async ({ event, context }) => {
  await context.db
    .insert(MessageAssignedV2)
    .values({
      id: `${context.network.chainId}-${event.block.number}-${event.transaction.transactionIndex}-${event.log.logIndex}`,
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,

      msgHash: event.args.msgHash,
      oracle: event.args.oracle,
      relayer: event.args.relayer,
      oracleFee: event.args.oracleFee,
      relayerFee: event.args.relayerFee,
    })
    .onConflictDoNothing();

  const existedAccepted = await context.db.find(MessageAcceptedV2, {
    id: event.args.msgHash,
  });
  if (!existedAccepted) {
    await context.db
      .insert(MessageAcceptedV2)
      .values({
        id: event.args.msgHash,
        blockNumber: event.block.number,
        blockTimestamp: event.block.timestamp,
        transactionHash: event.transaction.hash,
        logIndex: -1,
        msgHash: event.args.msgHash,
        messageChannel: "0x",
        messageIndex: 0n,
        messageFromChainId: 0n,
        messageFrom: "0x",
        messageToChainId: 0n,
        messageTo: "0x",
        messageGasLimit: 0n,
        messageEncoded: "0x",
      })
      .onConflictDoNothing();
  }
  if (
    address.listenRelayer.some(
      (item) => item.toLowerCase() === event.args.relayer.toLowerCase()
    )
  ) {
    await context.db.update(MessageAcceptedV2, { id: event.args.msgHash }).set({
      relayer: event.args.relayer,
      relayerAssigned: true,
      relayerAssignedFee: event.args.relayerFee,
      relayerLogIndex: event.log.logIndex,
    });
  }
  if (
    address.listenOracle.some(
      (item) => item.toLowerCase() === event.args.oracle.toLowerCase()
    )
  ) {
    await context.db.update(MessageAcceptedV2, { id: event.args.msgHash }).set({
      oracle: event.args.oracle,
      oracleAssigned: true,
      oracleAssignedFee: event.args.oracleFee,
      oracleLogIndex: event.log.logIndex,
    });
  }
});

ponder.on("ORMPV2:HashImported", async ({ event, context }) => {
  await context.db
    .insert(HashImportedV2)
    .values({
      id: `${context.network.chainId}-${event.block.number}-${event.transaction.transactionIndex}-${event.log.logIndex}`,
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
      srcChainId: event.args.chainId,
      channel: event.args.channel,
      msgIndex: event.args.msgIndex,
      targetChainId: BigInt(context.network.chainId),
      oracle: event.args.oracle,
      hash: event.args.hash,
    })
    .onConflictDoNothing();
});

if (process.env["ORMPONDER_ENABLE_SIGNATURE"]) {
  ponder.on("SignaturePub:SignatureSubmittion", async ({ event, context }) => {
    if (
      !address.listenSignature.some(
        (item) => item.toLowerCase() === event.args.channel.toLowerCase()
      )
    ) {
      return;
    }

    await context.db
      .insert(SignatureSubmittion)
      .values({
        id: `${context.network.chainId}-${event.block.number}-${event.transaction.transactionIndex}-${event.log.logIndex}`,
        blockNumber: event.block.number,
        blockTimestamp: event.block.timestamp,
        transactionHash: event.transaction.hash,

        srcChainId: event.args.chainId,
        channel: event.args.channel,
        msgIndex: event.args.msgIndex,
        signer: event.args.signer,
        signature: event.args.signature,
        data: event.args.data,
      })
      .onConflictDoNothing();
  });
}
