import { createConfig } from "@ponder/core";
import { http } from "viem";

import { ORMPAbi } from "./abis/ORMPAbi";

export default createConfig({
  networks: {
    tron_shasta: {
      chainId: 2494104990,
      transport: http("https://api.shasta.trongrid.io/jsonrpc"),
    },
  },
  contracts: {
    ORMP: {
      abi: ORMPAbi,
      address: "0x00000000001523057a05d6293C1e5171eE33eE0A",
      network: {
        tron_shasta: {
          startBlock: 42281878,
          address: "0x4a7C839b0a32c90ad3b397875df73B905b1Bf0CA", // TGm4AeM42R9ocbbN3ibrDtf5kkQVTTFMYS
        },
      },
      filter: {
        event: ["MessageAccepted", "MessageDispatched", "MessageAssigned"],
      },
    },
  },
});
