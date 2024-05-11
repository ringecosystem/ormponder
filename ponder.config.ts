import { createConfig } from "@ponder/core";
import { http } from "viem";

import { ORMPAbi as ORMPAbiV2 } from "./abis/v2/ORMPAbi";
import { SignaturePubAbi } from "./abis/v2/SignaturePubAbi";

// const INFURA_API_KEY = process.env.INFURA_API_KEY;
const INFURA_API_KEY = null;
const MAX_REQUESTS_PER_SECOND = 1;
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
          : "https://arbitrum-sepolia-rpc.publicnode.com"
      ),
      maxRequestsPerSecond: FAST_MAX_REQUESTS_PER_SECOND,
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
          : "https://ethereum-sepolia-rpc.publicnode.com"
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
          : "https://arbitrum-one-rpc.publicnode.com"
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
      maxRequestsPerSecond: MAX_REQUESTS_PER_SECOND,
    },
    darwinia: {
      chainId: 46,
      transport: http("http://c2.darwinia-rpc.itering.io:9944/"),
      maxRequestsPerSecond: MAX_REQUESTS_PER_SECOND,
    },
    ethereum: {
      chainId: 1,
      transport: http(
        // INFURA_API_KEY
        //   ? `https://mainnet.infura.io/v3/de35badc1ec7472da2967dd0248bd60c`
        //   : "https://ethereum.publicnode.com"

        "https://ethereum-rpc.publicnode.com"
      ),

      maxRequestsPerSecond: MAX_REQUESTS_PER_SECOND,
    },
    polygon: {
      chainId: 137,
      transport: http(
        POLYGON_INFURA_API_KEY
          ? `https://polygon-mainnet.infura.io/v3/${POLYGON_INFURA_API_KEY}`
          : "https://polygon-bor-rpc.publicnode.com"
      ),
      maxRequestsPerSecond: MAX_REQUESTS_PER_SECOND,
    },
  },
  contracts: {
    // === V2
    ORMPV2: {
      abi: ORMPAbiV2,
      address: "0x56F423Db036F2eDD05567b1211122E0B17C3bfF4",
      network: {
        // testnets
        pangolin: {
          startBlock: 2836100,
        },
        pangoro: {
          startBlock: 127804,
          address: "0xE46ed7594fFa6AD7c3b5232827EC2AF8f94beb38",
        },
        sepolia: {
          startBlock: 5877944,
        },
        arbitrum_sepolia: {
          startBlock: 42771116,
        },
        taiko_hekla: {
          startBlock: 113905,
        },
        tron_shasta: {
          startBlock: 43958393,
          address: "0x13c991C5BEf30c0E8600D95B8554B4DeDa4853b8", // TBmqJzYEQXJLBU4ycvMLPuqxMfEkVMeDQ8
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
          startBlock: 2667533,
        },
      },
    },
  },
});
