import { createConfig } from "@ponder/core";
import { http } from "viem";

import { ORMPAbi as ORMPAbiV2 } from "./abis/v2/ORMPAbi";
import { SignaturePubAbi } from "./abis/v2/SignaturePubAbi";

// const INFURA_API_KEY = process.env.INFURA_API_KEY;
const INFURA_API_KEY = null;
const MAX_REQUESTS_PER_SECOND = 5;
const FAST_MAX_REQUESTS_PER_SECOND = 10;

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
    koi: {
      chainId: 701,
      transport: http("https://koi-rpc.darwinia.network"),
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
    darwinia: {
      chainId: 46,
      transport: http("http://c1.darwinia-rpc.itering.io:9944/"),
      // transport: http("https://darwinia-hrpc.vercel.app/"),
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
        koi: {
          startBlock: 8073,
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
