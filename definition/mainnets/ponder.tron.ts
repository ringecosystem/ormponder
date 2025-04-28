import { createConfig } from "@ponder/core";
import { http } from "viem";

import { ORMPAbi as ORMPAbiV2 } from "./abis/v2/ORMPAbi";
import { MsgportAbi } from "./abis/v2/MsgportAbi";

const MAX_REQUESTS_PER_SECOND = 5;

export default createConfig({
  networks: {
    tron: {
      chainId: 728126428,
      transport: http(
        process.env.ENDPOINT_728126428 || "https://api.trongrid.io/jsonrpc"
      ),
      maxRequestsPerSecond: MAX_REQUESTS_PER_SECOND,
    },
  },
  contracts: {
    Msgport: {
      abi: MsgportAbi,
      address: "0x2cd1867Fb8016f93710B6386f7f9F1D540A60812",
      network: {
        tron: {
          startBlock: 62251337,
          address: "0x3Bc5362EC3a3DBc07292aEd4ef18Be18De02DA3a", // TFRF7t9m7pGLnwwX8TFsZvj85EvQ6gSBCm
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
