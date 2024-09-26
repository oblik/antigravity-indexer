import { createConfig } from "@ponder/core";
import { http } from "viem";

import { MiningRigAbi } from "./abis/MiningRigAbi";
import { DarkXAbi } from "./abis/DarkXAbi";
import { AntigravityAbi } from "./abis/AntigravityAbi";
import { WishWellReceiptAbi } from "./abis/WishWellReceiptAbi";
import { DarkClaimsAbi } from "./abis/DarkClaimsAbi";
import { DarkAbi } from "./abis/DarkAbi";
import { LaunchControlCenterAbi } from "./abis/LaunchControlCenterAbi";
import { FuelCellAbi } from "./abis/FuelCellAbi";
import { JourneyPhaseManagerAbi } from "./abis/JourneyPhaseManagerAbi";
import { EvilAddressAbi } from "./abis/EvilAddressAbi";
import { TreasuryAbi } from "./abis/TreasuryAbi";
import { JackpotAbi } from "./abis/JackpotAbi";

export default createConfig({
  networks: {
    sepolia: {
      chainId: 11155111,
      transport: http(process.env.PONDER_RPC_URL_11155111),
    },
  },
  contracts: {
    MiningRig: {
      network: "sepolia",
      address: "0x020d3Ca9605bb17CC17Ea0DB2bFfed3fA0869fCF",
      abi: MiningRigAbi,
      startBlock: 6283642,
    },
    DarkX: {
      network: "sepolia",
      address: "0xb1BF01E195D511509B12D980769351eF5255eE0f",
      abi: DarkXAbi,
      startBlock: 6283642,
    },
    Antigravity: {
      network: "sepolia",
      address: "0xbf4d8CD1563E222e62354aE7daa64739FccE310f",
      abi: AntigravityAbi,
      startBlock: 6283642,
    },
    WishWellReceipt: {
      network: "sepolia",
      address: "0x43F4cdC343f39EDD323C66492E9fdf3D72Df0eC0",
      abi: WishWellReceiptAbi,
      startBlock: 6283642,
    },
    DarkClaims: {
      network: "sepolia",
      address: "0x6b3099EfFF4dAE69e48240d88C141a7cfa793ae6",
      abi: DarkClaimsAbi,
      startBlock: 6283642,
    },
    Dark: {
      network: "sepolia",
      address: "0x20E070c2e6eB00bC0ACFD801778a1BE24D5423c1",
      abi: DarkAbi,
      startBlock: 6637197,
    },
    LaunchControlCenter: {
      network: "sepolia",
      address: "0x09d12a40EbeA8F7860a32973D514E6b55d279a2c",
      abi: LaunchControlCenterAbi,
      startBlock: 6637197,
    },
    FuelCell: {
      network: "sepolia",
      address: "0x77fB461abB743497dc23EB1e2a4fdEfAc35aFfea",
      abi: FuelCellAbi,
      startBlock: 6637197,
    },
    JourneyPhaseManager: {
      network: "sepolia",
      address: "0xA2893EBA6461c7e9142Bd5781E53782927894d61",
      abi: JourneyPhaseManagerAbi,
      startBlock: 6637197,
    },
    EvilAddress: {
      network: "sepolia",
      address: "0x86E29Dbd64F36a66d0Ddb96E2FF2A9d571fb41dB",
      abi: EvilAddressAbi,
      startBlock: 6637197,
    },
    Treasury: {
      network: "sepolia",
      address: "0xB52C954442f021D85Bd36103e742A07825a1af72",
      abi: TreasuryAbi,
      startBlock: 6637197,
    },
    Jackpot: {
      network: "sepolia",
      address: "0x3446Fd1cAd7ABA32b998B757767Be19569f866d6",
      abi: JackpotAbi,
      startBlock: 6637197,
    },
  },
});
