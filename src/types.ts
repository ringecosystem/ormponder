import { OrmpContractChain, OrmpContractConfig } from "./config";

export const evmFieldSelection = {
  transaction: {
    from: true,
    value: true,
    hash: true,
  },
  log: {
    transactionHash: true,
  },
};

export const tronFieldSelection = {
  block: {
    timestamp: true,
  },
  transaction: {
    hash: true,
  },
  log: {
    address: true,
    data: true,
    topics: true,
  },
  internalTransaction: {
    transferToAddress: true,
  },
};

export const ADDRESS_RELAYER = [
  "0x114890eB7386F94eae410186F20968bFAf66142a",
  "0xFF9b99c9F654DAFB00a9EbEd42D221b261ceB8a6", // TZGjiJcoqUo6JSZeYvrwN6qvpEcLm21QbG
].map((a) => a.toLowerCase());
export const ADDRESS_ORACLE = [
  "0xBE01B76AB454aE2497aE43168b1F70C92Ac1C726",
  "0x266Aa1Ef524b1D13C92bF3CC57cA7b12a0C72aB1", // TDULRJrJ2bbsvW3KKtEnnq9moPn5PyUWpd
].map((a) => a.toLowerCase());
export const ADDRESS_SIGNATURE = [
  "0x13b2211a7cA45Db2808F6dB05557ce5347e3634e",
  "0x5C5c383FEbE62F377F8c0eA1de97F2a2Ba102e98", // TJPZeFEdc4TBEcNbku5xVZLQ6B2Q1oGnd1
].map((a) => a.toLowerCase());

export type EvmFieldSelection = typeof evmFieldSelection;
export type TronFieldSelection = typeof tronFieldSelection;

export enum ProgressId {
  total = "total",
  inflight = "inflight",
  failed = "failed",
}

export interface EventInfo {
  id: string;
  chainId: bigint;
  logIndex: number;
  address: string;
  transactionIndex: number;
  transactionFrom: string;
}

export interface HandlerLifecycle {
  ormpContractChain: OrmpContractChain;
  ormpContractConfig: OrmpContractConfig;
}

export interface MessageProgressCount {
  total: bigint;
  inflight: bigint;
  failed: bigint;
}
