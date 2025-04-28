import { createConfig, loadBalance } from "ponder";
import { http } from "viem";

import { ORMPAbi as ORMPAbiV2 } from "./abis/v2/ORMPAbi";
import { MsgportAbi } from "./abis/v2/MsgportAbi";

export default createConfig({
  networks: {
    tron: {
      chainId: 728126428,
      transport: loadBalance([
        http(
          process.env.ENDPOINT_728126428 || "https://api.trongrid.io/jsonrpc"
        ),
      ]),
      // maxRequestsPerSecond: MAX_REQUESTS_PER_SECOND,
      pollingInterval: process.env.POLLING_INTERVAL_728126428
        ? Number(process.env.POLLING_INTERVAL_728126428)
        : 1000,
      maxRequestsPerSecond: process.env.MAX_REQUESTS_PER_SECOND_728126428
        ? Number(process.env.MAX_REQUESTS_PER_SECOND_728126428)
        : 5,
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
      filter: [
        { event: "MessageSent", args: {} },
        { event: "MessageRecv", args: {} },
      ],
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
      filter: [
        { event: "MessageAccepted", args: {} },
        { event: "MessageDispatched", args: {} },
        { event: "MessageAssigned", args: {} },
        { event: "HashImported", args: {} },
      ],
    },
  },
});
