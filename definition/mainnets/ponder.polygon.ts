import { createConfig, loadBalance } from "@ponder/core";
import { http } from "viem";

import { ORMPAbi as ORMPAbiV2 } from "./abis/v2/ORMPAbi";
import { MsgportAbi } from "./abis/v2/MsgportAbi";

const BLAST_API_KEY = process.env.BLAST_API_KEY;
const FAST_MAX_REQUESTS_PER_SECOND = 8;

export default createConfig({
  networks: {
    polygon: {
      chainId: 137,
      // transport: http(`https://polygon-mainnet.blastapi.io/${BLAST_API_KEY}`),
      transport: loadBalance([
        http(
          process.env.ENDPOINT_137 ||
            `https://polygon-mainnet.blastapi.io/${BLAST_API_KEY}`
        ),
        // http(`https://hrpc.darwinia.network/polygon`),
        // http(`https://polygon-mainnet.infura.io/v3/${INFURA_API_KEY}`)
      ]),
      maxRequestsPerSecond: FAST_MAX_REQUESTS_PER_SECOND,
    },
  },
  contracts: {
    Msgport: {
      abi: MsgportAbi,
      address: "0x2cd1867Fb8016f93710B6386f7f9F1D540A60812",
      network: {
        polygon: {
          startBlock: 59565,
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
        polygon: {
          startBlock: 57710686,
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
