import {createConfig} from "@ponder/core";
import {http} from "viem";

import {ORMPAbi as ORMPAbiV2} from "./abis/v2/ORMPAbi";

const INFURA_API_KEY = process.env.INFURA_API_KEY;
const BLAST_API_KEY = process.env.BLAST_API_KEY;
const MAX_REQUESTS_PER_SECOND = 5;
const FAST_MAX_REQUESTS_PER_SECOND = 20;

export default createConfig({
  networks: {
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
  },
});
