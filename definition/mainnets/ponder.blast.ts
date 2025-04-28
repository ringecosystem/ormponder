import { createConfig, loadBalance } from "ponder";
import { http } from "viem";

import { ORMPAbi as ORMPAbiV2 } from "./abis/v2/ORMPAbi";
import { MsgportAbi } from "./abis/v2/MsgportAbi";

const BLAST_API_KEY = process.env.BLAST_API_KEY;
const MAX_REQUESTS_PER_SECOND = 5;

export default createConfig({
  networks: {
    blast: {
      chainId: 81457,
      transport: loadBalance([
        http(
          process.env.ENDPOINT_81457 ||
            `https://blastl2-mainnet.blastapi.io/${BLAST_API_KEY}`
        ),
      ]),
      maxRequestsPerSecond: MAX_REQUESTS_PER_SECOND,
    },
  },
  contracts: {
    Msgport: {
      abi: MsgportAbi,
      address: "0x2cd1867Fb8016f93710B6386f7f9F1D540A60812",
      network: {
        blast: {
          startBlock: 4293849,
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
        blast: {
          startBlock: 4293849,
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
