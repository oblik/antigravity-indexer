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

  const nextFuelCellQuantity = calculateNftsToMint(journey + 1n);

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



const calculateNftsToMint = (currentJourney: bigint): bigint => {
  const STARTING_DARK_BALANCE = 650_000n * 10n**18n; // 650k Dark tokens
  const HUNDRED_PERCENT = 100n * 10n**8n; // 1e8 for percentage precision
  const DARK_DENOMINATION = 10n**18n; // Dark token decimals
  
  const nthValue = getSpendPercentage(currentJourney); // Returns percentage * 1e8
  const nftsToMintScaled = (STARTING_DARK_BALANCE * nthValue) / HUNDRED_PERCENT;
  return nftsToMintScaled / DARK_DENOMINATION;
}

const getSpendPercentage = (journeyId: bigint): bigint => {
  if (journeyId === 1n) return 10_3136_0000n; // 10.3136 * 1e8
  if (journeyId === 2n) return 9_2822_4000n;  // 9.28224 * 1e8
  if (journeyId === 3n) return 8_3540_1600n;  // 8.354016 * 1e8
  if (journeyId === 4n) return 7_5186_1400n;  // 7.518614 * 1e8
  if (journeyId === 5n) return 6_7667_5300n;  // 6.766753 * 1e8
  if (journeyId === 6n) return 6_0900_7800n;  // 6.090078 * 1e8
  if (journeyId === 7n) return 5_4810_7000n;  // 5.48107 * 1e8
  if (journeyId === 8n) return 4_9329_6300n;  // 4.932963 * 1e8
  if (journeyId === 9n) return 4_4396_6700n;  // 4.439667 * 1e8
  if (journeyId === 10n) return 3_9957_0000n; // 3.9957 * 1e8
  if (journeyId === 11n) return 3_5961_3000n; // 3.59613 * 1e8
  if (journeyId === 12n) return 3_2365_1700n; // 3.236517 * 1e8
  if (journeyId === 13n) return 2_9128_6500n; // 2.912865 * 1e8
  if (journeyId === 14n) return 2_6215_7900n; // 2.621579 * 1e8
  if (journeyId === 15n) return 2_3594_2100n; // 2.359421 * 1e8
  if (journeyId === 16n) return 2_1234_7900n; // 2.123479 * 1e8
  if (journeyId === 17n) return 1_9111_3100n; // 1.911131 * 1e8
  if (journeyId === 18n) return 1_7200_1800n; // 1.720018 * 1e8
  if (journeyId === 19n) return 1_5480_1600n; // 1.548016 * 1e8
  if (journeyId === 20n) return 1_3932_1400n; // 1.393214 * 1e8
  if (journeyId === 21n) return 1_2538_9300n; // 1.253893 * 1e8
  if (journeyId === 22n) return 1_1285_0400n; // 1.128504 * 1e8
  if (journeyId === 23n) return 1_0156_5300n; // 1.015653 * 1e8
  if (journeyId === 24n) return 914_0880n;    // 0.914088 * 1e8
  if (journeyId === 25n) return 822_6790n;    // 0.822679 * 1e8
  if (journeyId === 26n) return 740_4110n;    // 0.740411 * 1e8
  if (journeyId === 27n) return 666_3700n;    // 0.66637 * 1e8
  if (journeyId === 28n) return 599_7330n;    // 0.599733 * 1e8
  if (journeyId === 29n) return 539_7600n;    // 0.53976 * 1e8
  if (journeyId === 30n) return 485_7840n;    // 0.485784 * 1e8
  if (journeyId === 31n) return 437_2050n;    // 0.437205 * 1e8
  if (journeyId === 32n) return 393_4850n;    // 0.393485 * 1e8
  return 354_1360n;                           // 0.354136 * 1e8
}
