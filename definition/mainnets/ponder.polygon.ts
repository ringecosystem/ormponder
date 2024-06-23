import {createConfig, loadBalance} from "@ponder/core";
import {http} from "viem";

import {ORMPAbi as ORMPAbiV2} from "./abis/v2/ORMPAbi";

const INFURA_API_KEY = process.env.INFURA_API_KEY;
const BLAST_API_KEY = process.env.BLAST_API_KEY;
const MAX_REQUESTS_PER_SECOND = 5;
const FAST_MAX_REQUESTS_PER_SECOND = 8;

export default createConfig({
  networks: {
    polygon: {
      chainId: 137,
      // transport: http(`https://polygon-mainnet.blastapi.io/${BLAST_API_KEY}`),
      transport: loadBalance([
        http(`https://polygon-mainnet.blastapi.io/${BLAST_API_KEY}`),
        // http(`https://hrpc.darwinia.network/polygon`),
        // http(`https://polygon-mainnet.infura.io/v3/${INFURA_API_KEY}`)
      ]),
      maxRequestsPerSecond: FAST_MAX_REQUESTS_PER_SECOND,
    },
  },
  contracts: {
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
