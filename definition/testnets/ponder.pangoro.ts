import { createConfig, loadBalance } from "@ponder/core";
import { http } from "viem";

import { ORMPAbi as ORMPAbiV2 } from "./abis/v2/ORMPAbi";
import { SignaturePubAbi } from "./abis/v2/SignaturePubAbi";

const INFURA_API_KEY = process.env.INFURA_API_KEY;
// const INFURA_API_KEY = null;
const MAX_REQUESTS_PER_SECOND = 5;
const FAST_MAX_REQUESTS_PER_SECOND = 10;

export default createConfig({
  networks: {
    pangoro: {
      chainId: 45,
      transport: http(
        "https://fraa-flashbox-2871-rpc.a.stagenet.tanssi.network"
      ),
      maxRequestsPerSecond: FAST_MAX_REQUESTS_PER_SECOND,
    },
  },
  contracts: {
    // === V2
    ORMPV2: {
      abi: ORMPAbiV2,
      address: "0x13b2211a7cA45Db2808F6dB05557ce5347e3634e",
      network: {
        // testnets
        koi: {
          startBlock: 42300,
        },
        pangoro: {
          startBlock: 356208,
        },
        sepolia: {
          startBlock: 6083800,
        },
        arbitrum_sepolia: {
          startBlock: 53486700,
        },
        taiko_hekla: {
          startBlock: 311800,
        },
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
