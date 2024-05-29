import { createConfig } from "@ponder/core";
import { http } from "viem";

import { ORMPAbi as ORMPAbiV2 } from "../../abis/v2/ORMPAbi";
import { SignaturePubAbi } from "../../abis/v2/SignaturePubAbi";

// const INFURA_API_KEY = process.env.INFURA_API_KEY;
const INFURA_API_KEY = null;
const MAX_REQUESTS_PER_SECOND = 5;
const FAST_MAX_REQUESTS_PER_SECOND = 10;
const POLYGON_INFURA_API_KEY = process.env.INFURA_API_KEY;

export default createConfig({
  networks: {
    // testnets
    arbitrum_sepolia: {
      chainId: 421614,
      transport: http(
        INFURA_API_KEY
          ? `https://arbitrum-sepolia.infura.io/v3/${INFURA_API_KEY}`
          // : "https://arbitrum-sepolia-hrpc.vercel.app/"
          : "https://sepolia-rollup.arbitrum.io/rpc"
      ),
      maxRequestsPerSecond: MAX_REQUESTS_PER_SECOND,
    },
    pangolin: {
      chainId: 43,
      transport: http("http://g1.testnets.darwinia.network:9940"),
      maxRequestsPerSecond: MAX_REQUESTS_PER_SECOND,
    },
    pangoro: {
      chainId: 45,
      transport: http("https://fraa-flashbox-2871-rpc.a.stagenet.tanssi.network"),
      maxRequestsPerSecond: FAST_MAX_REQUESTS_PER_SECOND,
    },
    sepolia: {
      chainId: 11155111,
      transport: http(
        INFURA_API_KEY
          ? `https://sepolia.infura.io/v3/${INFURA_API_KEY}`
          // : "https://sepolia-hrpc.vercel.app/"
          : "https://rpc2.sepolia.org"
      ),
      maxRequestsPerSecond: MAX_REQUESTS_PER_SECOND,
    },
    taiko_hekla: {
      chainId: 167009,
      transport: http("https://rpc.hekla.taiko.xyz"),
      maxRequestsPerSecond: FAST_MAX_REQUESTS_PER_SECOND,
    },
    tron_shasta: {
      chainId: 2494104990,
      transport: http("https://api.shasta.trongrid.io/jsonrpc"),
      maxRequestsPerSecond: MAX_REQUESTS_PER_SECOND,
    },
    // mainnets
    arbitrum: {
      chainId: 42161,
      transport: http(
        INFURA_API_KEY
          ? `https://arbitrum-mainnet.infura.io/v3/${INFURA_API_KEY}`
          : "https://arb1.arbitrum.io/rpc"
          // : "https://arbitrum-hrpc.vercel.app/"
      ),
      maxRequestsPerSecond: MAX_REQUESTS_PER_SECOND,
    },
    blast: {
      chainId: 81457,
      transport: http(
        INFURA_API_KEY
          ? `https://blast-mainnet.infura.io/v3/${INFURA_API_KEY}`
          : "https://rpc.blast.io"
      ),
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
      transport: http(
        // INFURA_API_KEY
        //   ? `https://mainnet.infura.io/v3/de35badc1ec7472da2967dd0248bd60c`

        "https://eth-mainnet.public.blastapi.io"
      ),

      maxRequestsPerSecond: MAX_REQUESTS_PER_SECOND,
    },
    polygon: {
      chainId: 137,
      transport: http(
        POLYGON_INFURA_API_KEY
          ? `https://polygon-mainnet.infura.io/v3/${POLYGON_INFURA_API_KEY}`
          : "https://polygon-bor-rpc.publicnode.com"
          // : "https://polygon-hrpc.vercel.app/"
      ),
      maxRequestsPerSecond: MAX_REQUESTS_PER_SECOND,
    },
  },
  contracts: {
    // === V2
    ORMPV2: {
      abi: ORMPAbiV2,
      address: "0xA72d283015c01807bc0788Bf22C1A774bDbFC8fA",
      network: {
        // testnets
        pangolin: {
          startBlock: 2936734,
        },
        pangoro: {
          startBlock: 229000,
        },
        sepolia: {
          startBlock: 5967541,
        },
        arbitrum_sepolia: {
          startBlock: 47378439,
        },
        taiko_hekla: {
          startBlock: 204774,
        },
        tron_shasta: {
          startBlock: 44338539,
          address: "0x841B6b2F3148131Ac161d88edFb2C11F146e189F", // TN1j3Ttt1c1mB3X2zdKkdMsUK6pZyLCxSr
        },
        // mainnets
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
      address: "0xb2aa34fde97ffdb6197dd5a2be23c2121405cc12",
      network: {
        darwinia: {
          startBlock: 2761609,
        },
      },
    },
  },
});
