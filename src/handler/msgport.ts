import {
  DataHandlerContext as EvmTronDataHandlerContext,
  Log as EvmLog,
} from "@subsquid/evm-processor";
import { Store } from "@subsquid/typeorm-store";
import {
  EventInfo,
  EvmFieldSelection,
  HandlerLifecycle,
  ProgressId,
  TronFieldSelection,
} from "../types";
import {
  DataHandlerContext as TronDataHandlerContext,
  Log as TronLog,
} from "@subsquid/tron-processor";
import * as msgportAbi from "../abi/ormpupgradeableport";
import {
  // MessagePort,
  // MessageProgress,
  ORMPMessageAccepted,
  ORMPUpgradeablePortMessageRecv,
  ORMPUpgradeablePortMessageSent,
} from "../model";
import * as helpers from "../helpers";

export class MsgportEvmHandler {
  private readonly msgportHandler: MsgportHandler;

  constructor(
    private readonly ctx: EvmTronDataHandlerContext<Store, EvmFieldSelection>,
    private readonly lifecycle: HandlerLifecycle
  ) {
    this.msgportHandler = new MsgportHandler(this.ctx.store, this.lifecycle);
  }

  async handle(eventLog: EvmLog<EvmFieldSelection>) {
    const { ormpContractChain } = this.lifecycle;
    const isMessageRecv =
      eventLog.topics.findIndex((item) =>
        helpers.compareHashString(item, msgportAbi.events.MessageRecv.topic)
      ) !== -1;
    const isMessageSend =
      eventLog.topics.findIndex((item) =>
        helpers.compareHashString(item, msgportAbi.events.MessageSent.topic)
      ) !== -1;
    const eventInfo: EventInfo = {
      id: eventLog.id,
      chainId: BigInt(ormpContractChain.chainId),
      logIndex: eventLog.logIndex,
      address: helpers.stdHashString(eventLog.address),
      transactionIndex: eventLog.transactionIndex,
      transactionFrom: helpers.stdHashString(eventLog.getTransaction().from),
    };
    if (isMessageRecv) {
      const event = msgportAbi.events.MessageRecv.decode(eventLog);
      const entity = new ORMPUpgradeablePortMessageRecv({
        id: eventLog.id,
        chainId: eventInfo.chainId,
        msgId: helpers.stdHashString(event.msgId),
        result: event.result,
        returnData: event.returnData,
        blockNumber: BigInt(eventLog.block.height),
        blockTimestamp: BigInt(eventLog.block.timestamp),
        transactionHash: helpers.stdHashString(eventLog.transactionHash),
        transactionIndex: eventInfo.transactionIndex,
        logIndex: eventInfo.logIndex,
        portAddress: eventInfo.address,
      });
      await this.msgportHandler.storeMessageRecv(entity, eventInfo);
    }
    if (isMessageSend) {
      const event = msgportAbi.events.MessageSent.decode(eventLog);
      const entity = new ORMPUpgradeablePortMessageSent({
        id: eventLog.id,
        chainId: eventInfo.chainId,
        msgId: helpers.stdHashString(event.msgId),
        fromDapp: event.fromDapp,
        toChainId: event.toChainId,
        toDapp: event.toDapp,
        message: event.message,
        params: event.params,
        blockNumber: BigInt(eventLog.block.height),
        blockTimestamp: BigInt(eventLog.block.timestamp),
        transactionHash: helpers.stdHashString(eventLog.transactionHash),
        transactionIndex: eventInfo.transactionIndex,
        transactionFrom: eventInfo.transactionFrom,
        logIndex: eventInfo.logIndex,
        portAddress: eventInfo.address,
      });
      await this.msgportHandler.storeMessageSent(entity, eventInfo);
    }
  }
}

export class MsgportTronHandler {
  private readonly msgportHandler: MsgportHandler;

  constructor(
    private readonly ctx: TronDataHandlerContext<Store, TronFieldSelection>,
    private readonly lifecycle: HandlerLifecycle
  ) {
    this.msgportHandler = new MsgportHandler(this.ctx.store, this.lifecycle);
  }

  async handle(eventLog: TronLog<TronFieldSelection>) {
    const { ormpContractChain } = this.lifecycle;
    if (!eventLog.topics) {
      this.ctx.log.warn(`[msgport] no topics in event log: ${eventLog}`);
      return;
    }
    if (!eventLog.data) {
      this.ctx.log.warn(`[msgport] no event log data: ${eventLog}`);
      return;
    }
    const isMessageRecv =
      eventLog.topics.findIndex((item) =>
        helpers.compareHashString(item, msgportAbi.events.MessageRecv.topic)
      ) !== -1;
    const isMessageSend =
      eventLog.topics.findIndex((item) =>
        helpers.compareHashString(item, msgportAbi.events.MessageSent.topic)
      ) !== -1;

    let tx = eventLog.getTransaction();
    let eventEvm = {
      topics: eventLog.topics.map((t) => helpers.stdHashString(t)),
      data: helpers.stdHashString(eventLog.data),
    };
    const internalTx = tx.internalTransactions[eventLog.logIndex];
    const eventInfo: EventInfo = {
      id: eventLog.id,
      chainId: BigInt(ormpContractChain.chainId),
      logIndex: eventLog.logIndex,
      address: helpers.stdHashString(eventLog.address),
      transactionIndex: tx.transactionIndex,
      transactionFrom: helpers.stdHashString(internalTx.callerAddress),
    };
    if (isMessageRecv) {
      const event = msgportAbi.events.MessageRecv.decode(eventEvm);
      const entity = new ORMPUpgradeablePortMessageRecv({
        id: eventLog.id,
        chainId: eventInfo.chainId,
        msgId: helpers.stdHashString(event.msgId),
        result: event.result,
        returnData: event.returnData,
        blockNumber: BigInt(eventLog.block.height),
        blockTimestamp: BigInt(eventLog.block.timestamp),
        transactionHash: helpers.stdHashString(tx.hash),
        transactionIndex: eventInfo.transactionIndex,
        logIndex: eventInfo.logIndex,
        portAddress: eventInfo.address,
      });
      await this.msgportHandler.storeMessageRecv(entity, eventInfo);
    }
    if (isMessageSend) {
      const event = msgportAbi.events.MessageSent.decode(eventEvm);
      const entity = new ORMPUpgradeablePortMessageSent({
        id: eventLog.id,
        chainId: eventInfo.chainId,
        msgId: helpers.stdHashString(event.msgId),
        fromDapp: event.fromDapp,
        toChainId: event.toChainId,
        toDapp: event.toDapp,
        message: event.message,
        params: event.params,
        blockNumber: BigInt(eventLog.block.height),
        blockTimestamp: BigInt(eventLog.block.timestamp),
        transactionHash: helpers.stdHashString(tx.hash),
        transactionIndex: eventInfo.transactionIndex,
        transactionFrom: eventInfo.transactionFrom,
        logIndex: eventInfo.logIndex,
        portAddress: eventInfo.address,
      });
      await this.msgportHandler.storeMessageSent(entity, eventInfo);
    }
  }
}

class MsgportHandler {
  constructor(
    private readonly store: Store,
    private readonly lifecycle: HandlerLifecycle
  ) {}
  async storeMessageRecv(
    event: ORMPUpgradeablePortMessageRecv,
    eventInfo: EventInfo
  ) {
    await this.store.insert(event);

    // // msgport
    // const storedMessagePort = await this.store.findOne(MessagePort, {
    //   where: { id: helpers.stdHashString(event.msgId) },
    // });
    // const storedMessageAccept = await this.store.findOne(ORMPMessageAccepted, {
    //   where: { id: helpers.stdHashString(event.msgId) },
    // });
    // const currentMessagePort = new MessagePort({
    //   ...storedMessagePort,
    //   id: helpers.stdHashString(event.msgId),
    //   ormp: storedMessageAccept,
    //   protocol: "ormp",
    //   status: storedMessagePort?.status ?? (event.result ? 1 : 2),
    //   targetBlockNumber: event.blockNumber,
    //   targetBlockTimestamp: event.b,
    //   targetChainId: event.chainId,
    //   targetLogIndex: eventInfo.logIndex,
    //   targetPortAddress: eventInfo.address,
    //   targetTransactionHash: event.transactionHash,
    //   targetTransactionIndex: eventInfo.transactionIndex,
    // });
    // if (storedMessagePort) {
    //   await this.store.save(currentMessagePort);
    // } else {
    //   await this.store.insert(currentMessagePort);
    // }
  }

  async storeMessageSent(
    event: ORMPUpgradeablePortMessageSent,
    eventInfo: EventInfo
  ) {
    await this.store.insert(event);

    // // msgport
    // const storedMessagePort = await this.store.findOne(MessagePort, {
    //   where: { id: helpers.stdHashString(event.msgId) },
    // });
    // const storedMessageAccept = await this.store.findOne(ORMPMessageAccepted, {
    //   where: { id: helpers.stdHashString(event.msgId) },
    // });
    // const currentMessagePort = new MessagePort({
    //   ...storedMessagePort,
    //   id: helpers.stdHashString(event.msgId),
    //   ormp: storedMessageAccept,
    //   protocol: "ormp",
    //   payload: event.message,
    //   params: event.params,

    //   sender: eventInfo.transactionFrom,

    //   sourceChainId: event.chainId,
    //   sourceBlockNumber: event.blockNumber,
    //   sourceBlockTimestamp: event.blockTimestamp,
    //   sourceTransactionHash: event.transactionHash,
    //   sourceTransactionIndex: eventInfo.transactionIndex,
    //   sourceLogIndex: eventInfo.logIndex,
    //   sourceDappAddress: event.fromDapp,
    //   sourcePortAddress: eventInfo.address,

    //   targetChainId: event.toChainId,
    //   targetDappAddress: event.toDapp,

    //   status: storedMessagePort ? storedMessagePort.status : 0,
    // });
    // if (storedMessagePort) {
    //   await this.store.save(currentMessagePort);
    // } else {
    //   await this.store.insert(currentMessagePort);
    // }

    // // store progress
    // const { messageProgressCount } = this.lifecycle;
    // messageProgressCount.total += 1n;
    // messageProgressCount.inflight += 1n;

    // // store progress
    // const storedProgressTotal = await this.store.findOne(MessageProgress, {
    //   where: { id: ProgressId.total },
    // });
    // const storedProgressInflight = await this.store.findOne(MessageProgress, {
    //   where: { id: ProgressId.inflight },
    // });
    // const currentProgressTotal =
    //   storedProgressTotal ??
    //   new MessageProgress({
    //     id: ProgressId.total,
    //     amount: 0n,
    //   });
    // const currentProgressInflight =
    //   storedProgressInflight ??
    //   new MessageProgress({
    //     id: ProgressId.inflight,
    //     amount: 0n,
    //   });
    // currentProgressTotal.amount += 1n;
    // currentProgressInflight.amount += 1n;
    // if (storedProgressTotal) {
    //   await this.store.save(currentProgressTotal);
    // } else {
    //   await this.store.insert(currentProgressTotal);
    // }
    // if (storedProgressInflight) {
    //   await this.store.save(currentProgressInflight);
    // } else {
    //   await this.store.insert(currentProgressInflight);
    // }
  }
}
