import {createConfig} from "@ponder/core";
import {http} from "viem";

import {ORMPAbi as ORMPAbiV2} from "./abis/v2/ORMPAbi";

const INFURA_API_KEY = process.env.INFURA_API_KEY;
// const INFURA_API_KEY = null;
const MAX_REQUESTS_PER_SECOND = 5;
const FAST_MAX_REQUESTS_PER_SECOND = 10;

export default createConfig({
  networks: {
    tron_shasta: {
      chainId: 2494104990,
      transport: http("https://api.shasta.trongrid.io/jsonrpc"),
      maxRequestsPerSecond: MAX_REQUESTS_PER_SECOND,
    },
  },
  contracts: {
    // === V2
    ORMPV2: {
      abi: ORMPAbiV2,
      address: "0x13b2211a7cA45Db2808F6dB05557ce5347e3634e",
      network: {
        tron_shasta: {
          startBlock: 44847100,
          address: "0x924A4b87900A8CE8F8Cf62360Db047C4e4fFC1a3", // TPJifBA5MvFf918VYnajd2XmEept4iBX55
        },
        // mainnets
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
