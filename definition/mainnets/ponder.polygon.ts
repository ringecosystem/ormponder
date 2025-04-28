import { createConfig, loadBalance } from "ponder";
import { http } from "viem";

import { ORMPAbi as ORMPAbiV2 } from "./abis/v2/ORMPAbi";
import { MsgportAbi } from "./abis/v2/MsgportAbi";

const BLAST_API_KEY = process.env.BLAST_API_KEY;

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
      // maxRequestsPerSecond: FAST_MAX_REQUESTS_PER_SECOND,
      pollingInterval: process.env.POLLING_INTERVAL_137
        ? Number(process.env.POLLING_INTERVAL_137)
        : 1000,
      maxRequestsPerSecond: process.env.MAX_REQUESTS_PER_SECOND_137
        ? Number(process.env.MAX_REQUESTS_PER_SECOND_137)
        : 8,
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
        polygon: {
          startBlock: 57710686,
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
