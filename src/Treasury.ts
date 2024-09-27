import { ponder } from "@/generated";
import { generateFuelCellId, generateJPMId, generateTreasuryId, generateYieldId } from "./utils/idGenerator";
import { Inputs } from "./types";

ponder.on("Treasury:AdminChanged", async ({ event, context }) => {
  // console.log(event.args);
});

ponder.on("Treasury:YieldPayedOut", handleYieldPayedOut);

ponder.on("Treasury:FuelCellUnwrapped", handleFuelCellUnwrapped);

ponder.on("Treasury:Initialized", handleInitialized);


async function handleYieldPayedOut({event,context}: Inputs): Promise<void> {
  const { args, log, block, transaction } = event;
  const { db, network, client, contracts } = context;
  const {
    User: UserEntity,
    JourneyPhaseManager: JourneyPhaseManagerEntity,
    Treasury: TreasuryEntity,
    YieldPayout: YieldPayoutEntity,
    Mint: MintEntity,
    Transfer: TransferEntity,
    FuelCell: FuelCellEntity,
    FuelCellContract: FuelCellContractEntity
  } = db;

  const {yieldValue, yieldGivenIn, journeyId, totalNftsInJourney} = args;

  const treasuryId = generateTreasuryId(contracts.Treasury.address);
  await TreasuryEntity.update({
    id: treasuryId,
    data: ({current}) => ({
      totalYieldPayedOut: current.totalYieldPayedOut + yieldValue,
      recentYieldJourneyId: BigInt(yieldGivenIn)
    })
  });

  const yieldId = generateYieldId(contracts.Treasury.address, journeyId, yieldGivenIn);
  await YieldPayoutEntity.create({
    id: yieldId,
    data: {
      treasuryId: treasuryId,
      journeyId: BigInt(journeyId),
      givenIn: BigInt(yieldGivenIn),
      yieldValue: yieldValue,
      totalFuelCellsInJourney: totalNftsInJourney,
      amountPerFuelCell: BigInt(yieldValue / totalNftsInJourney),
      blockNumber: block.number,
      timestamp: block.timestamp,
      transactionHash: log.transactionHash,
    }
  });
}

async function handleFuelCellUnwrapped({event,context}: Inputs): Promise<void> {
  const { args, log, block, transaction } = event;
  const { db, network, client, contracts } = context;
  const {
    User: UserEntity,
    JourneyPhaseManager: JourneyPhaseManagerEntity,
    Treasury: TreasuryEntity,
    Mint: MintEntity,
    Transfer: TransferEntity,
    FuelCell: FuelCellEntity,
    FuelCellContract: FuelCellContractEntity
  } = db;

  const {fuelCellId} = args;
  // get params
  const fuelCellAddress = contracts.FuelCell.address;
  const jpmAddress = contracts.JourneyPhaseManager.address;

  // generate IDs
  const fuelCellTokenId = generateFuelCellId(fuelCellAddress, fuelCellId);
  const jpmId = generateJPMId(jpmAddress);
  const treasuryId = generateTreasuryId(contracts.Treasury.address);

  // get data from blockchain
  let totalYieldClaimed;

  // update Treasury
  await TreasuryEntity.update({
    id: treasuryId,
    data: {
      totalYieldClaimed: totalYieldClaimed
    }
  });

  // update JPM
  await JourneyPhaseManagerEntity.update({
    id: jpmId,
    data: ({current}) => ({
      totalActiveFuelCells: current.totalActiveFuelCells - 1n,
      totalFuelCellsBurned: current.totalFuelCellsBurned + 1n
    })
  });

  // update FuelCell
  await FuelCellEntity.update({
    id: fuelCellTokenId,
    data: {
      isUnwrapped: true
    }
  });
}

async function handleInitialized({event,context}: Inputs): Promise<void> {
  console.log(`Calling Handle Initialized for Treasury`);
  console.log(`Calling Handle Initialized for Treasury`);
  console.log(`Calling Handle Initialized for Treasury`);
  console.log(`Calling Handle Initialized for Treasury`);
  console.log(`Calling Handle Initialized for Treasury`);
  console.log(`Calling Handle Initialized for Treasury`);
  const { args, log, block, transaction } = event;
  const { db, network, client, contracts } = context;
  const {
    User: UserEntity,
    JourneyPhaseManager: JourneyPhaseManagerEntity,
    Treasury: TreasuryEntity,
    Mint: MintEntity,
    Transfer: TransferEntity,
    FuelCell: FuelCellEntity,
    FuelCellContract: FuelCellContractEntity
  } = db;
  const treasuryId = generateTreasuryId(contracts.Treasury.address);

  await TreasuryEntity.create({
    id: treasuryId,
    data: {
      address: contracts.Treasury.address,
      totalYieldPayedOut: 0n,
      totalYieldClaimed: 0n,
      recentYieldJourneyId: 0n
    }
  });
}

