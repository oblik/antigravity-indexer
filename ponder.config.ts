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
import { base, pulsechain, pulsechainV4 } from "viem/chains";

const MINING_RIG_ADDRESS=process.env.MINING_RIG_ADDRESS as string;
const DARKX_ADDRESS=process.env.DARKX_ADDRESS as string;
const ANTIGRAVITY_ADDRESS=process.env.ANTIGRAVITY_ADDRESS as string;
const DARK_CLAIMS_ADDRESS=process.env.DARK_CLAIMS_ADDRESS as string;
const DARK_ADDRESS=process.env.DARK_ADDRESS as string;
const WISHWELL_ADDRESS=process.env.WISHWELL_ADDRESS as string;
const FC_ADDRESS=process.env.FC_ADDRESS as string;
const LCC_ADDRESS=process.env.LCC_ADDRESS as string;
const JPM_ADDRESS=process.env.JPM_ADDRESS as string;
const EVIL_ADDRESS=process.env.EVIL_ADDRESS as string;
const TREASURY_ADDRESS=process.env.TREASURY_ADDRESS as string;
const JACKPOT_ADDRESS=process.env.JACKPOT_ADDRESS as string;

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
    },
    pulsechain: {
      chainId: pulsechain.id,
      transport: http(process.env.PONDER_PULSECHAIN_URL)
    },
    base: {
      chainId: base.id,
      transport: http(process.env.PONDER_BASE_URL)
    },
    pulsechainV4: {
      chainId: pulsechainV4.id,
      transport: http(process.env.PONDER_PULSECHAIN_V4_URL)
    }
  },
  blocks: {
    JourneyUpdateOnInterval: {
      network: process.env.NETWORK as "baseSepolia" | "sepolia" | "pulsechain" | "base" | "pulsechainV4",
      startBlock: parseInt(process.env.LATEST_BLOCK as string),
      interval: blockInterval
    },
  },
  contracts: {
    MiningRig: {
      network: process.env.NETWORK as "baseSepolia" | "sepolia" | "pulsechain" | "base" | "pulsechainV4",
      address: MINING_RIG_ADDRESS,
      abi: MiningRigAbi,
      startBlock: parseInt(process.env.START_BLOCK_ERA2 as string),
    },
    DarkX: {
      network: process.env.NETWORK as "baseSepolia" | "sepolia" | "pulsechain" | "base" | "pulsechainV4",
      address: DARKX_ADDRESS,
      abi: DarkXAbi,
      startBlock: parseInt(process.env.START_BLOCK_ERA2 as string),
    },
    Antigravity: {
      network: process.env.NETWORK as "baseSepolia" | "sepolia" | "pulsechain" | "base" | "pulsechainV4",
      address: ANTIGRAVITY_ADDRESS,
      abi: AntigravityAbi,
      startBlock: parseInt(process.env.START_BLOCK_ERA2 as string),
    },
    WishWellReceipt: {
      network: process.env.NETWORK as "baseSepolia" | "sepolia" | "pulsechain" | "base" | "pulsechainV4",
      address: WISHWELL_ADDRESS,
      abi: WishWellReceiptAbi,
      startBlock: parseInt(process.env.START_BLOCK_ERA1 as string),
    },
    DarkClaims: {
      network: process.env.NETWORK as "baseSepolia" | "sepolia" | "pulsechain" | "base" | "pulsechainV4",
      address: DARK_CLAIMS_ADDRESS,
      abi: DarkClaimsAbi,
      startBlock: parseInt(process.env.START_BLOCK_ERA3 as string),
    },
    Dark: {
      network: process.env.NETWORK as "baseSepolia" | "sepolia" | "pulsechain" | "base" | "pulsechainV4",
      address: DARK_ADDRESS,
      abi: DarkAbi,
      startBlock: parseInt(process.env.START_BLOCK_ERA3 as string),
    },
    LaunchControlCenter: {
      network: process.env.NETWORK as "baseSepolia" | "sepolia" | "pulsechain" | "base" | "pulsechainV4",
      address: LCC_ADDRESS,
      abi: LaunchControlCenterAbi,
      startBlock: parseInt(process.env.START_BLOCK_ERA3 as string),
    },
    FuelCell: {
      network: process.env.NETWORK as "baseSepolia" | "sepolia" | "pulsechain" | "base" | "pulsechainV4",
      address: FC_ADDRESS,
      abi: FuelCellAbi,
      startBlock: parseInt(process.env.START_BLOCK_ERA3 as string),
    },
    JourneyPhaseManager: {
      network: process.env.NETWORK as "baseSepolia" | "sepolia" | "pulsechain" | "base" | "pulsechainV4",
      address: JPM_ADDRESS,
      abi: JourneyPhaseManagerAbi,
      startBlock: parseInt(process.env.START_BLOCK_ERA3 as string),
    },
    EvilAddress: {
      network: process.env.NETWORK as "baseSepolia" | "sepolia" | "pulsechain" | "base" | "pulsechainV4",
      address: EVIL_ADDRESS,
      abi: EvilAddressAbi,
      startBlock: parseInt(process.env.START_BLOCK_ERA3 as string),
    },
    Treasury: {
      network: process.env.NETWORK as "baseSepolia" | "sepolia" | "pulsechain" | "base" | "pulsechainV4",
      address: TREASURY_ADDRESS,
      abi: TreasuryAbi,
      startBlock: parseInt(process.env.START_BLOCK_ERA3 as string),
    },
    Jackpot: {
      network: process.env.NETWORK as "baseSepolia" | "sepolia" | "pulsechain" | "base" | "pulsechainV4",
      address: JACKPOT_ADDRESS,
      abi: JackpotAbi,
      startBlock: parseInt(process.env.START_BLOCK_ERA3 as string),
    },
  },
});
