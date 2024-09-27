import { ponder } from "@/generated";
import { Inputs } from "./types";
import { generateFuelCellId } from "./utils/idGenerator";

ponder.on("Jackpot:LotterResultAnnounced", handleLotterResultAnnounced);

ponder.on("Jackpot:WinningPruned", handleWinningPruned);

ponder.on("Jackpot:BonusAdded", handleBonusAdded);

ponder.on("Jackpot:Initialized", handleInitialized);


export function generateJackpotId(address: string): string {
  return address;
}

export function generateLotteryResultId(address: string, journeyId: BigInt, lotteryId: BigInt): string {
  return address.concat(journeyId.toString()).concat(lotteryId.toString());
}

export function generateWinningPrunedId(address: string, journeyId: BigInt, lotteryId: BigInt, tokenId: BigInt): string {
  return address.concat(journeyId.toString()).concat(lotteryId.toString()).concat(tokenId.toString());
}

async function handleBonusAdded({event,context}: Inputs): Promise<void> {
  const { args, log, block, transaction } = event;
  const { db, network, client, contracts } = context;
  const {
    User: UserEntity,
    Jackpot: JackpotEntity,
    JourneyPhaseManager: JourneyPhaseManagerEntity,
    Treasury: TreasuryEntity,
    YieldPayout: YieldPayoutEntity,
    Mint: MintEntity,

    Transfer: TransferEntity,
    FuelCell: FuelCellEntity,
    FuelCellContract: FuelCellContractEntity
  } = db;

  const {bonusAmount} = args;
  const jackpotId = generateJackpotId(contracts.Jackpot.address);
  await JackpotEntity.update({
    id: jackpotId,
    data: ({current}) => ({
      bonus: current.bonus + bonusAmount
    })
  });
}

async function handleLotterResultAnnounced({event,context}: Inputs): Promise<void> {
  const { args, log, block, transaction } = event;
  const { db, network, client, contracts } = context;
  const {
    User: UserEntity,
    Jackpot: JackpotEntity,
    LotteryResult: LotteryResultEntity,
    JourneyPhaseManager: JourneyPhaseManagerEntity,
    Treasury: TreasuryEntity,
    YieldPayout: YieldPayoutEntity,
    Mint: MintEntity,
    Transfer: TransferEntity,
    FuelCell: FuelCellEntity,
    FuelCellContract: FuelCellContractEntity
  } = db;

  const {journey, lottery, payout, numberOfWinners} = args;

  const jackpotId = generateJackpotId(contracts.Jackpot.address);
  await JackpotEntity.update({
    id: jackpotId,
    data: ({current}) => ({
      currentJourneyId: BigInt(journey),
      currentLotteryId: BigInt(lottery),
      totalPayedOut: current.totalPayedOut + payout
    })
  });

  const [, root, uri,] = await client.readContract({
    abi: contracts.Jackpot.abi,
    address: contracts.Jackpot.address,
    functionName: "lotteryPayouts",
    args: [journey, lottery]
  });

  const lotteryResultId = generateLotteryResultId(contracts.Jackpot.address, BigInt(journey), BigInt(lottery));
  await LotteryResultEntity.create({
    id: lotteryResultId,
    data: ({
      jackpotId: jackpotId,
      journeyId: BigInt(journey),
      lotteryId: BigInt(lottery),
      numberOfWinners: numberOfWinners,
      payout: payout,
      payoutPerFuelCell: BigInt(payout / numberOfWinners),
      root: root,
      uri: uri,
      blockNumber: block.number,
      timestamp: block.timestamp,
      transactionHash: log.transactionHash
    })
  });
}

async function handleWinningPruned({event,context}: Inputs): Promise<void> {
  const { args, log, block, transaction } = event;
  const { db, network, client, contracts } = context;
  const {
    User: UserEntity,
    Jackpot: JackpotEntity,
    WinningPruned: WinningPrunedEntity,
    LotteryResult: LotteryResultEntity,
    JourneyPhaseManager: JourneyPhaseManagerEntity,
    Treasury: TreasuryEntity,
    YieldPayout: YieldPayoutEntity,
    Mint: MintEntity,
    Transfer: TransferEntity,
    FuelCell: FuelCellEntity,
    FuelCellContract: FuelCellContractEntity
  } = db;

  const {journeyId, lotteryId, tokenId, winningAmount} = args;

  const jackpotId = generateJackpotId(contracts.Jackpot.address);
  await JackpotEntity.update({
    id: jackpotId,
    data: ({current}) => ({
      totalClaimed: current.totalClaimed + winningAmount
    })
  });

  const fuelCellAddress = contracts.FuelCell.address;
  const fuelCellId = generateFuelCellId(fuelCellAddress, tokenId);

  const winningPrunedId = generateWinningPrunedId(contracts.Jackpot.address, BigInt(journeyId), BigInt(lotteryId), tokenId);
  await WinningPrunedEntity.create({
    id: winningPrunedId,
    data: ({
      jackpotId: jackpotId,
      journeyId: BigInt(journeyId),
      lotteryId: BigInt(lotteryId),
      fuelCellId: fuelCellId,
      winningAmount: winningAmount,
      blockNumber: block.number,
      timestamp: block.timestamp,
      transactionHash: log.transactionHash
    })
  });

  await FuelCellEntity.update({
    id: fuelCellId,
    data: {
      winningId: winningPrunedId
    }
  });
}

async function handleInitialized({event,context}: Inputs): Promise<void> {
  console.log(`Calling Handle Initialized for Jackpot`);
  console.log(`Calling Handle Initialized for Jackpot`);
  console.log(`Calling Handle Initialized for Jackpot`);
  console.log(`Calling Handle Initialized for Jackpot`);
  console.log(`Calling Handle Initialized for Jackpot`);
  console.log(`Calling Handle Initialized for Jackpot`);
  const { args, log, block, transaction } = event;
  const { db, network, client, contracts } = context;
  const {
    User: UserEntity,
    Jackpot: JackpotEntity,
    JourneyPhaseManager: JourneyPhaseManagerEntity,
    Treasury: TreasuryEntity,
    YieldPayout: YieldPayoutEntity,
    Mint: MintEntity,
    Transfer: TransferEntity,
    FuelCell: FuelCellEntity,
    FuelCellContract: FuelCellContractEntity
  } = db;

  const jackpotId = generateJackpotId(contracts.Jackpot.address);
  await JackpotEntity.create({
    id: jackpotId,
    data: {
      address: contracts.Jackpot.address,
      bonus: 0n,
      currentLotteryId: 0n,
      currentJourneyId: 0n,
      totalPayedOut: 0n,
      totalClaimed: 0n,
    }
  });
}
