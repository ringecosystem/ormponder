import { createConfig, loadBalance } from "@ponder/core";
import { http } from "viem";

import { ORMPAbi as ORMPAbiV2 } from "./abis/v2/ORMPAbi";
import { MsgportAbi } from "./abis/v2/MsgportAbi";

const INFURA_API_KEY = process.env.INFURA_API_KEY;
const BLAST_API_KEY = process.env.BLAST_API_KEY;
const MAX_REQUESTS_PER_SECOND = 5;
const FAST_MAX_REQUESTS_PER_SECOND = 20;

export default createConfig({
  networks: {
    crab: {
      chainId: 44,
      transport: loadBalance([
        http(process.env.ENDPOINT_44 || "http://c1.crab-rpc.itering.io:9944/"),
        // http("https://hrpc.darwinia.network/crab"),
        // http("http://c2.crab-rpc.itering.io:9944/"),
        // http("http://g1.crab2.darwinia.network:9944/"),
        // http("http://c1.crab2.darwinia.network:9944/"),
      ]),
      maxRequestsPerSecond: MAX_REQUESTS_PER_SECOND,
    },
  },
  contracts: {
    Msgport: {
      abi: MsgportAbi,
      address: "0x2cd1867Fb8016f93710B6386f7f9F1D540A60812",
      network: {
        crab: {
          startBlock: 2900604,
        },
      },
      filter: {
        event: ["MessageSent", "MessageRecv"],
      },
    },
    // === V2
    ORMPV2: {
      abi: ORMPAbiV2,
      address: "0x13b2211a7cA45Db2808F6dB05557ce5347e3634e",
      network: {
        crab: {
          startBlock: 2900604,
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
