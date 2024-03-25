import { createConfig } from "@ponder/core";
import { http } from "viem";

import { ORMPAbi as ORMPAbiV2 } from "./abis/v2/ORMPAbi";
import { ORMPAbi as ORMPAbiV1 } from "./abis/v1/ORMPAbi";
import { ORMPOracleAbi as ORMPOracleAbiV1 } from "./abis/v1/ORMPOracleAbi";
import { ORMPRelayerAbi as ORMPRelayerAbiV1 } from "./abis/v1/ORMPRelayerAbi";

const INFURA_API_KEY = process.env.INFURA_API_KEY;
const MAX_REQUESTS_PER_SECOND = 1;

const v1Networks = {
  // testnets
  arbitrum_sepolia: {
    startBlock: 860637,
  },
  pangolin: {
    startBlock: 2275723,
  },
  sepolia: {
    startBlock: 4728915,
  },
  // mainnets
  arbitrum: {
    startBlock: 148555417,
  },
  blast: {
    startBlock: 364290,
  },
  crab: {
    startBlock: 1658340,
  },
  darwinia: {
    startBlock: 1389410,
  },
  ethereum: {
    startBlock: 18753083,
  },
  polygon: {
    startBlock: 54050910,
  },
};

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
        INFURA_API_KEY
          ? `https://polygon-mainnet.infura.io/v3/${INFURA_API_KEY}`
          : "https://polygon-bor-rpc.publicnode.com"
      ),
      maxRequestsPerSecond: MAX_REQUESTS_PER_SECOND,
    },
  },
  contracts: {
    // === V2
    ORMPV2: {
      abi: ORMPAbiV2,
      address: "0x00000000001523057a05d6293C1e5171eE33eE0A",
      network: {
        tron_shasta: {
          startBlock: 42281878,
          address: "0x4a7C839b0a32c90ad3b397875df73B905b1Bf0CA", // TGm4AeM42R9ocbbN3ibrDtf5kkQVTTFMYS
        },
      },
      filter: {
        event: ["MessageAccepted", "MessageDispatched", "MessageAssigned"],
      },
    },

    // === V1
    ORMPV1: {
      abi: ORMPAbiV1,
      address: "0x00000000001523057a05d6293C1e5171eE33eE0A",
      network: v1Networks,
      filter: {
        event: ["MessageAccepted", "MessageDispatched"],
      },
    },
    ORMPOracleV1: {
      abi: ORMPOracleAbiV1,
      address: "0x0000000003ebeF32D8f0ED406a5CA8805c80AFba",
      network: v1Networks,
      filter: {
        event: ["Assigned"],
      },
    },
    ORMPRelayerV1: {
      abi: ORMPRelayerAbiV1,
      address: "0x0000000000808fE9bDCc1d180EfbF5C53552a6b1",
      network: v1Networks,
      filter: {
        event: ["Assigned"],
      },
    },
  },
});
