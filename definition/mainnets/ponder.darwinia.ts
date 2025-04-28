import { createConfig, loadBalance } from "ponder";
import { http } from "viem";

import { ORMPAbi as ORMPAbiV2 } from "./abis/v2/ORMPAbi";
import { MsgportAbi } from "./abis/v2/MsgportAbi";
import { SignaturePubAbi } from "./abis/v2/SignaturePubAbi";

export default createConfig({
  networks: {
    darwinia: {
      chainId: 46,
      transport: loadBalance([
        http(
          process.env.ENDPOINT_46 || "http://c2.darwinia-rpc.itering.io:9944/"
        ),
      ]),
      pollingInterval: process.env.POLLING_INTERVAL_46
        ? Number(process.env.POLLING_INTERVAL_46)
        : 1000,
      maxRequestsPerSecond: process.env.MAX_REQUESTS_PER_SECOND_46
        ? Number(process.env.MAX_REQUESTS_PER_SECOND_46)
        : 5,
    },
  },
  contracts: {
    Msgport: {
      abi: MsgportAbi,
      address: "0x2cd1867Fb8016f93710B6386f7f9F1D540A60812",
      network: {
        darwinia: {
          startBlock: 2830139,
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
        darwinia: {
          startBlock: 2830100,
        },
      },
      filter: [
        { event: "MessageAccepted", args: {} },
        { event: "MessageDispatched", args: {} },
        { event: "MessageAssigned", args: {} },
        { event: "HashImported", args: {} },
      ],
    },
    SignaturePub: {
      abi: SignaturePubAbi,
      address: "0x57aa601a0377f5ab313c5a955ee874f5d495fc92",
      network: {
        darwinia: {
          startBlock: 6489588,
        },
      },
    },
  },
});
