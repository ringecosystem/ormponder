import {createConfig} from "@ponder/core";
import {http} from "viem";

import {ORMPAbi as ORMPAbiV2} from "./abis/v2/ORMPAbi";

const INFURA_API_KEY = process.env.INFURA_API_KEY;
const BLAST_API_KEY = process.env.BLAST_API_KEY;
const MAX_REQUESTS_PER_SECOND = 5;
const FAST_MAX_REQUESTS_PER_SECOND = 20;

export default createConfig({
  networks: {
    ethereum: {
      chainId: 1,
      // transport: http(`https://eth-mainnet.blastapi.io/${BLAST_API_KEY}`),
      transport: http(`https://mainnet.infura.io/v3/${INFURA_API_KEY}`),

      maxRequestsPerSecond: MAX_REQUESTS_PER_SECOND,
    },
  },
  contracts: {
    // === V2
    ORMPV2: {
      abi: ORMPAbiV2,
      address: "0x13b2211a7cA45Db2808F6dB05557ce5347e3634e",
      network: {
        ethereum: {
          startBlock: 20009605,
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
