import { createConfig, loadBalance } from "@ponder/core";
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
      transport: loadBalance([
        http("https://arbitrum-sepolia-hrpc.vercel.app/"),
        http("https://sepolia-rollup.arbitrum.io/rpc"),
        // http(`https://arbitrum-sepolia.infura.io/v3/${INFURA_API_KEY}`),
      ]),
      maxRequestsPerSecond: FAST_MAX_REQUESTS_PER_SECOND,
    },
    koi: {
      chainId: 701,
      transport: http("https://koi-rpc.darwinia.network"),
      maxRequestsPerSecond: MAX_REQUESTS_PER_SECOND,
    },
    pangoro: {
      chainId: 45,
      transport: http(
        "https://fraa-flashbox-2871-rpc.a.stagenet.tanssi.network"
      ),
      maxRequestsPerSecond: FAST_MAX_REQUESTS_PER_SECOND,
    },
    sepolia: {
      chainId: 11155111,
      transport: loadBalance([
        http("https://rpc2.sepolia.org"),
        http("https://sepolia-hrpc.vercel.app/"),
        // http(`https://sepolia.infura.io/v3/${INFURA_API_KEY}`),
      ]),
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
      transport: loadBalance([
        http("http://c1.darwinia-rpc.itering.io:9944/"),
        http("https://darwinia-hrpc.vercel.app/"),
      ]),
      maxRequestsPerSecond: MAX_REQUESTS_PER_SECOND,
    },
  },
  contracts: {
    // === V2
    ORMPV2: {
      abi: ORMPAbiV2,
      address: "0x13b2211a7cA45Db2808F6dB05557ce5347e3634e",
      network: {
        // testnets
        // koi: {
        //   startBlock: 8073,
        // },
        pangoro: {
          startBlock: 356208,
        },
        sepolia: {
          startBlock: 6083800,
        },
        arbitrum_sepolia: {
          startBlock: 53486700,
        },
        taiko_hekla: {
          startBlock: 311800,
        },
        tron_shasta: {
          startBlock: 44847100,
          address: "0x924A4b87900A8CE8F8Cf62360Db047C4e4fFC1a3", // TPJifBA5MvFf918VYnajd2XmEept4iBX55
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
          startBlock: 2885094,
        },
      },
    },
  },
});
