import { createConfig } from "@ponder/core";
import { http } from "viem";

import { ORMPAbi as ORMPAbiV2 } from "./abis/v2/ORMPAbi";
import { SignaturePubAbi } from "./abis/v2/SignaturePubAbi";

// const INFURA_API_KEY = process.env.INFURA_API_KEY;
const INFURA_API_KEY = null;
const MAX_REQUESTS_PER_SECOND = 1;
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
      maxRequestsPerSecond: MAX_REQUESTS_PER_SECOND,
    },
    pangolin: {
      chainId: 43,
      transport: http("https://pangolin-rpc.darwinia.network"),
      maxRequestsPerSecond: MAX_REQUESTS_PER_SECOND,
    },
    sepolia: {
      chainId: 11155111,
      transport: http(
        INFURA_API_KEY
          ? `https://sepolia.infura.io/v3/${INFURA_API_KEY}`
          : "https://ethereum-sepolia.publicnode.com"
      ),
      maxRequestsPerSecond: MAX_REQUESTS_PER_SECOND,
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
          : "https://arbitrum-one.publicnode.com"
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
      transport: http("https://crab-rpc.darwinia.network"),
      maxRequestsPerSecond: MAX_REQUESTS_PER_SECOND,
    },
    darwinia: {
      chainId: 46,
      transport: http("http://c2.collator.itering.io:9944"),
      maxRequestsPerSecond: MAX_REQUESTS_PER_SECOND,
    },
    ethereum: {
      chainId: 1,
      transport: http(
        // INFURA_API_KEY
        //   ? `https://mainnet.infura.io/v3/de35badc1ec7472da2967dd0248bd60c`
        //   : "https://ethereum.publicnode.com"

        "https://ethereum.publicnode.com"
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
      address: "0x42165Ce95b51D1B845C190C96fB30c4FeF6Abce4",
      network: {
        // testnets
        sepolia: {
          startBlock: 5579141,
        },
        arbitrum_sepolia: {
          startBlock: 31200402
        },
        tron_shasta: {
          startBlock: 42281878,
          address: "0x4a7C839b0a32c90ad3b397875df73B905b1Bf0CA", // TGm4AeM42R9ocbbN3ibrDtf5kkQVTTFMYS
        },
        // mainnets
      },
      filter: {
        event: ["MessageAccepted", "MessageDispatched", "MessageAssigned", "HashImported"],
      },
    },
    SignaturePub: {
      abi: SignaturePubAbi,
      address: "0xb2aa34fde97ffdb6197dd5a2be23c2121405cc12",
      network: {
        darwinia: {
          startBlock: 2442860,
        }
      }
    },
  },
});
