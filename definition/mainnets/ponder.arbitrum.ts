import { createConfig, loadBalance } from "@ponder/core";
import { http } from "viem";

import { ORMPAbi as ORMPAbiV2 } from "./abis/v2/ORMPAbi";
import { MsgportAbi } from "./abis/v2/MsgportAbi";

const BLAST_API_KEY = process.env.BLAST_API_KEY;
const FAST_MAX_REQUESTS_PER_SECOND = 20;

export default createConfig({
  networks: {
    arbitrum: {
      chainId: 42161,
      transport: http(
        process.env.ENDPOINT_42161 ||
          `https://arbitrum-one.blastapi.io/${BLAST_API_KEY}`
      ),
      maxRequestsPerSecond: FAST_MAX_REQUESTS_PER_SECOND,
    },
  },
  contracts: {
    Msgport: {
      abi: MsgportAbi,
      address: "0x2cd1867Fb8016f93710B6386f7f9F1D540A60812",
      network: {
        arbitrum: {
          startBlock: 217896912,
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
        arbitrum: {
          startBlock: 217891600,
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
