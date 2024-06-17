import { createConfig, loadBalance } from "@ponder/core";
import { http } from "viem";

import { ORMPAbi as ORMPAbiV2 } from "./abis/v2/ORMPAbi";
import { SignaturePubAbi } from "./abis/v2/SignaturePubAbi";

const INFURA_API_KEY = process.env.INFURA_API_KEY;
const BLAST_API_KEY = process.env.BLAST_API_KEY;
const MAX_REQUESTS_PER_SECOND = 5;
const FAST_MAX_REQUESTS_PER_SECOND = 20;

export default createConfig({
  networks: {
    arbitrum: {
      chainId: 42161,
      transport: loadBalance([
        http(`https://arbitrum-one.blastapi.io/${BLAST_API_KEY}`),
        // "https://arb1.arbitrum.io/rpc"
        http("https://hrpc.darwinia.network/arbitrum"),
        // "https://rpc.ankr.com/arbitrum"
      ]),
      maxRequestsPerSecond: FAST_MAX_REQUESTS_PER_SECOND,
    },
    blast: {
      chainId: 81457,
      transport: http("https://rpc.blast.io"),
      maxRequestsPerSecond: MAX_REQUESTS_PER_SECOND,
    },
    crab: {
      chainId: 44,
      transport: loadBalance([
        http("http://c1.crab-rpc.itering.io:9944/"),
        // http("https://hrpc.darwinia.network/crab"),
        // http("http://c2.crab-rpc.itering.io:9944/"),
      ]),
      maxRequestsPerSecond: MAX_REQUESTS_PER_SECOND,
    },
    darwinia: {
      chainId: 46,
      transport: http("http://c1.darwinia-rpc.itering.io:9944/"),
      // transport: http("https://hrpc.darwinia.network/darwinia"),
      maxRequestsPerSecond: MAX_REQUESTS_PER_SECOND,
    },
    ethereum: {
      chainId: 1,
      // transport: http(`https://eth-mainnet.blastapi.io/${BLAST_API_KEY}`),
      transport: http(`https://mainnet.infura.io/v3/${INFURA_API_KEY}`),

      maxRequestsPerSecond: MAX_REQUESTS_PER_SECOND,
    },
    moonbeam: {
      chainId: 1284,
      transport: http(`https://moonbeam.blastapi.io/${BLAST_API_KEY}`),
      maxRequestsPerSecond: MAX_REQUESTS_PER_SECOND,
    },
    polygon: {
      chainId: 137,
      // transport: http(`https://polygon-mainnet.blastapi.io/${BLAST_API_KEY}`),
      transport: loadBalance([
        http(`https://polygon-mainnet.blastapi.io/${BLAST_API_KEY}`),
        // http(`https://hrpc.darwinia.network/polygon`),
      ]),
      maxRequestsPerSecond: FAST_MAX_REQUESTS_PER_SECOND,
    },
    tron: {
      chainId: 728126428,
      transport: http("https://api.trongrid.io/jsonrpc"),
      maxRequestsPerSecond: MAX_REQUESTS_PER_SECOND,
    },
  },
  contracts: {
    // === V2
    ORMPV2: {
      abi: ORMPAbiV2,
      address: "0x13b2211a7cA45Db2808F6dB05557ce5347e3634e",
      network: {
        arbitrum: {
          startBlock: 217891600,
        },
        blast: {
          startBlock: 4293849,
        },
        crab: {
          startBlock: 2900604,
        },
        darwinia: {
          startBlock: 2830100,
        },
        ethereum: {
          startBlock: 20009605,
        },
        moonbeam: {
          startBlock: 6294138,
        },
        polygon: {
          startBlock: 57710686,
        },
        tron: {
          startBlock: 62251337,
          address: "0x5C5c383FEbE62F377F8c0eA1de97F2a2Ba102e98", // TJPZeFEdc4TBEcNbku5xVZLQ6B2Q1oGnd1
        },
      },
      filter: {
        event: [
          "MessageAccepted",
          "MessageDispatched",
          "MessageAssigned",
          "HashImported",
        ],
      },
    },
    SignaturePub: {
      abi: SignaturePubAbi,
      address: "0x57aa601a0377f5ab313c5a955ee874f5d495fc92",
      network: {
        darwinia: {
          startBlock: 2849900,
        },
      },
    },
  },
});
