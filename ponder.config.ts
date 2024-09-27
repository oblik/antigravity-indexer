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

const MINING_RIG_ADDRESS =  "0x8Dea737AE483153c69934ff8a5c7E3D448c2DB4C"
const DARKX_ADDRESS =  "0xdE87E198D2A5d6894a03AfCb34876601A6dd226f"
const ANTIGRAVITY_ADDRESS =  "0xe2150da9bCe4B63f89Ebf61cD3f89EB7f3fB3F05"
const DARK_CLAIMS_ADDRESS =  "0x6b3099EfFF4dAE69e48240d88C141a7cfa793ae6"
const DARK_ADDRESS =  "0x63F5a917dD86Ce6cF1C20BEb06bcf1c44fe4d1d3"
const WISHWELL_ADDRESS =  "0xC8A96A9163C2D11e2002C589a5DC7Ee4267499e2"
const FC_ADDRESS="0xF08b0e7cd2b68Cf4969acc2c2E37B0c870fC973b"
const LCC_ADDRESS="0x7D6a4B2c4400D12C203d9a3c0D4F4220bc0108a3"
const JPM_ADDRESS="0x0Ed0DAd2b0D0813Cc0060cD55061F0aacf10D9f4"
const EVIL_ADDRESS="0x4fffddfc07b68968B262f7aF814E6cAc14C6a46e"
const TREASURY_ADDRESS="0x0cFf76fcaC678a8a030C738e6080471a16eeD63F"
const JACKPOT_ADDRESS="0x1d068C6D621C4493dE7308e31eA03C25E0e3E728"

const blockInterval = parseInt(process.env.BLOCK_INTERVAL as string);

export default createConfig({
  networks: {
    sepolia: {
      chainId: 11155111,
      transport: http(process.env.PONDER_RPC_URL_11155111),
    },
    baseSepolia: {
      chainId: 84532,
      transport: http(process.env.PONDER_BASE_SEPOLIA_URL)
    }
  },
  blocks: {
    JourneyUpdateOnInterval: {
      network: process.env.NETWORK as "baseSepolia" | "sepolia",
      startBlock: parseInt(process.env.LATEST_BLOCK as string),
      interval: blockInterval
    },
  },
  contracts: {
    MiningRig: {
      network: process.env.NETWORK as "baseSepolia" | "sepolia",
      address: MINING_RIG_ADDRESS,
      abi: MiningRigAbi,
      startBlock: parseInt(process.env.START_BLOCK_ERA2 as string),
    },
    DarkX: {
      network: process.env.NETWORK as "baseSepolia" | "sepolia",
      address: DARKX_ADDRESS,
      abi: DarkXAbi,
      startBlock: parseInt(process.env.START_BLOCK_ERA2 as string),
    },
    Antigravity: {
      network: process.env.NETWORK as "baseSepolia" | "sepolia",
      address: ANTIGRAVITY_ADDRESS,
      abi: AntigravityAbi,
      startBlock: parseInt(process.env.START_BLOCK_ERA2 as string),
    },
    WishWellReceipt: {
      network: process.env.NETWORK as "baseSepolia" | "sepolia",
      address: WISHWELL_ADDRESS,
      abi: WishWellReceiptAbi,
      startBlock: parseInt(process.env.START_BLOCK_ERA1 as string),
    },
    DarkClaims: {
      network: process.env.NETWORK as "baseSepolia" | "sepolia",
      address: DARK_CLAIMS_ADDRESS,
      abi: DarkClaimsAbi,
      startBlock: parseInt(process.env.START_BLOCK_ERA3 as string),
    },
    Dark: {
      network: process.env.NETWORK as "baseSepolia" | "sepolia",
      address: DARK_ADDRESS,
      abi: DarkAbi,
      startBlock: parseInt(process.env.START_BLOCK_ERA3 as string),
    },
    LaunchControlCenter: {
      network: process.env.NETWORK as "baseSepolia" | "sepolia",
      address: LCC_ADDRESS,
      abi: LaunchControlCenterAbi,
      startBlock: parseInt(process.env.START_BLOCK_ERA3 as string),
    },
    FuelCell: {
      network: process.env.NETWORK as "baseSepolia" | "sepolia",
      address: FC_ADDRESS,
      abi: FuelCellAbi,
      startBlock: parseInt(process.env.START_BLOCK_ERA3 as string),
    },
    JourneyPhaseManager: {
      network: process.env.NETWORK as "baseSepolia" | "sepolia",
      address: JPM_ADDRESS,
      abi: JourneyPhaseManagerAbi,
      startBlock: parseInt(process.env.START_BLOCK_ERA3 as string),
    },
    EvilAddress: {
      network: process.env.NETWORK as "baseSepolia" | "sepolia",
      address: EVIL_ADDRESS,
      abi: EvilAddressAbi,
      startBlock: parseInt(process.env.START_BLOCK_ERA3 as string),
    },
    Treasury: {
      network: process.env.NETWORK as "baseSepolia" | "sepolia",
      address: TREASURY_ADDRESS,
      abi: TreasuryAbi,
      startBlock: parseInt(process.env.START_BLOCK_ERA3 as string),
    },
    Jackpot: {
      network: process.env.NETWORK as "baseSepolia" | "sepolia",
      address: JACKPOT_ADDRESS,
      abi: JackpotAbi,
      startBlock: parseInt(process.env.START_BLOCK_ERA3 as string),
    },
  },
});
