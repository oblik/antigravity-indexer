import { ponder } from "@/generated";
import { generateEvilId, generateEvilMintId } from "./utils/idGenerator";
import { Inputs } from "./types";

ponder.on("EvilAddress:EvilMintExecuted", handleEvilMintExecuted);

ponder.on("EvilAddress:EvilPruned", handleEvilPruned);

ponder.on("EvilAddress:Initialized", handleInitialized);


async function handleEvilMintExecuted({event,context}: Inputs): Promise<void> {
  const { args, log, block, transaction } = event;
  const { db, network, client, contracts } = context;
  const {
    User: UserEntity,
    EvilAddress: EvilAddressEntity,
    EvilMint: EvilMintEntity,
    JourneyPhaseManager: JourneyPhaseManagerEntity,
    Mint: MintEntity,
    Transfer: TransferEntity,
    FuelCell: FuelCellEntity,
    FuelCellContract: FuelCellContractEntity
  } = db;
  // treasury fee update
  const {journey, nftsMinted} = args;

  const nextFuelCellQuantity = await client.readContract({
    abi: contracts.EvilAddress.abi,
    address: contracts.EvilAddress.address,
    functionName: 'calculateNftsToMint',
    args: [journey + 1n]
  });

  const evilId = generateEvilId(contracts.EvilAddress.address);
  await EvilAddressEntity.update({
    id: evilId,
    data: {
      latestEvilMintJourney: journey,
      nextFuelCellMintQuantity: nextFuelCellQuantity
    }
  });

  // create evil mint entity
  const evilMintId = generateEvilMintId(contracts.EvilAddress.address, journey, event.log.transactionHash, BigInt(log.logIndex));
  await EvilMintEntity.create({
    id: evilMintId,
    data: {
      journeyId: journey,
      totalMinted: nftsMinted,
      evilId: evilId,
      blockNumber: event.block.number,
      timestamp: event.block.timestamp,
      transactionHash: event.log.transactionHash
    }
  });
}

async function handleEvilPruned({event,context}: Inputs): Promise<void> {
  const { args, log, block, transaction } = event;
  const { db, network, client, contracts } = context;
  const {
    User: UserEntity,
    EvilAddress: EvilAddressEntity,
    EvilMint: EvilMintEntity,
    JourneyPhaseManager: JourneyPhaseManagerEntity,
    Mint: MintEntity,
    Transfer: TransferEntity,
    FuelCell: FuelCellEntity,
    FuelCellContract: FuelCellContractEntity
  } = db;
  // treasury fee update
  const evilId = generateEvilId(contracts.EvilAddress.address);

  await EvilAddressEntity.update({
    id: evilId,
    data: {
      recentPruneTimestamp: block.timestamp,
      recentPruneBlockNumber: block.number,
      recentPruneTransactionHash: log.transactionHash
    }
  });
}

async function handleInitialized({event,context}: Inputs): Promise<void> {
  console.log(`Calling Handle Initialized for Evil`);
  console.log(`Calling Handle Initialized for Evil`);
  console.log(`Calling Handle Initialized for Evil`);
  console.log(`Calling Handle Initialized for Evil`);
  console.log(`Calling Handle Initialized for Evil`);
  console.log(`Calling Handle Initialized for Evil`);
  const { args, log, block, transaction } = event;
  const { db, network, client, contracts } = context;
  const {
    EvilAddress: EvilAddressEntity
  } = db;
  const evilId = generateEvilId(contracts.EvilAddress.address);

  const nextFuelCellQuantity = await client.readContract({
    abi: contracts.EvilAddress.abi,
    address: contracts.EvilAddress.address,
    functionName: 'calculateNftsToMint',
    args: [1n]
  });

  await EvilAddressEntity.create({
    id: evilId,
    data: {
      address: contracts.EvilAddress.address,
      latestEvilMintJourney: 0n,
      nextFuelCellMintQuantity: nextFuelCellQuantity,
      recentPruneTimestamp: 0n,
      recentPruneBlockNumber: 0n,
      recentPruneTransactionHash: "Bytes.empty()",
    }
  });
}
