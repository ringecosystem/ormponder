import { createConfig, loadBalance } from "ponder";
import { http } from "viem";

import { ORMPAbi as ORMPAbiV2 } from "./abis/v2/ORMPAbi";
import { MsgportAbi } from "./abis/v2/MsgportAbi";

const BLAST_API_KEY = process.env.BLAST_API_KEY;

export default createConfig({
  networks: {
    ethereum: {
      chainId: 1,
      transport: loadBalance([
        http(
          process.env.ENDPOINT_1 ||
            `https://eth-mainnet.blastapi.io/${BLAST_API_KEY}`
        ),
        // http(`https://mainnet.infura.io/v3/${INFURA_API_KEY}`),
      ]),
      pollingInterval: process.env.POLLING_INTERVAL_1
        ? Number(process.env.POLLING_INTERVAL_1)
        : 1000,
      maxRequestsPerSecond: process.env.MAX_REQUESTS_PER_SECOND_1
        ? Number(process.env.MAX_REQUESTS_PER_SECOND_1)
        : 5,
    },
  },
  contracts: {
    Msgport: {
      abi: MsgportAbi,
      address: "0x2cd1867Fb8016f93710B6386f7f9F1D540A60812",
      network: {
        ethereum: {
          startBlock: 20009590,
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
        ethereum: {
          startBlock: 20009605,
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
