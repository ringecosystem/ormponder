import { createConfig } from "@ponder/core";
import { http } from "viem";

import { ORMPAbi as ORMPAbiV2 } from "./abis/v2/ORMPAbi";
import { SignaturePubAbi } from "./abis/v2/SignaturePubAbi";

const INFURA_API_KEY = process.env.INFURA_API_KEY;
const BLAST_API_KEY = process.env.BLAST_API_KEY;
const MAX_REQUESTS_PER_SECOND = 5;
const FAST_MAX_REQUESTS_PER_SECOND = 10;

export default createConfig({
  networks: {
    arbitrum: {
      chainId: 42161,
      transport: http(
        // `https://arbitrum-one.blastapi.io/${BLAST_API_KEY}`
        "https://arb1.arbitrum.io/rpc"
      ),
      maxRequestsPerSecond: MAX_REQUESTS_PER_SECOND,
    },
    blast: {
      chainId: 81457,
      transport: http("https://rpc.blast.io"),
      maxRequestsPerSecond: MAX_REQUESTS_PER_SECOND,
    },
    crab: {
      chainId: 44,
      transport: http("http://c2.crab-rpc.itering.io:9944/"),
      // transport: http("https://crab-hrpc.vercel.app/"),
      maxRequestsPerSecond: MAX_REQUESTS_PER_SECOND,
    },
    darwinia: {
      chainId: 46,
      transport: http("http://c1.darwinia-rpc.itering.io:9944/"),
      // transport: http("https://darwinia-hrpc.vercel.app/"),
      maxRequestsPerSecond: MAX_REQUESTS_PER_SECOND,
    },
    ethereum: {
      chainId: 1,
      transport: http(`https://eth-mainnet.blastapi.io/${BLAST_API_KEY}`),

      maxRequestsPerSecond: MAX_REQUESTS_PER_SECOND,
    },
    moonbeam: {
      chainId: 1284,
      transport: http(`https://moonbeam.blastapi.io/${BLAST_API_KEY}`),
      maxRequestsPerSecond: MAX_REQUESTS_PER_SECOND,
    },
    polygon: {
      chainId: 137,
      transport: http(`https://polygon-mainnet.infura.io/v3/${INFURA_API_KEY}`),
      maxRequestsPerSecond: MAX_REQUESTS_PER_SECOND,
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
      address: "0xA72d283015c01807bc0788Bf22C1A774bDbFC8fA",
      network: {
        arbitrum: {
          startBlock: 216132417,
        },
        blast: {
          startBlock: 4073496,
        },
        crab: {
          startBlock: 2872009,
        },
        darwinia: {
          startBlock: 2795207,
        },
        ethereum: {
          startBlock: 19973128,
        },
        moonbeam: {
          startBlock: 6257873,
        },
        polygon: {
          startBlock: 57514953,
        },
        tron: {
          startBlock: 62104493,
          address: "0x152c6DdDD0A4cfD817af7Cf4cf5491D4AC44e886", // TBuAR5bP2KoJ6Thx4zFqGChSARNRYrknTD
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
          startBlock: 2795207,
        },
      },
    },
  },
});
