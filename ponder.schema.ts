import { createSchema } from "@ponder/core";

export default createSchema((p) => ({
  User: p.createTable({
    id: p.string(),
    address: p.string(),
    totalMined: p.bigint(),
    darkxbalance: p.bigint(),
    darkBalance: p.bigint(),
    isAllowlisted: p.boolean(),
    isHolderOfDark: p.boolean(),
    fuelCellBalance: p.bigint(),
    totalMintedFuelCell: p.bigint(),
    wishwellId: p.string().optional().references("WishWell.id"),
    antigravityId: p.string().optional().references("Antigravity.id"),

    // relationships
    wishwell: p.one("wishwellId"),
    darkTransferSent: p.many("DarkTransfer.fromId"),
    darkTransferReceived: p.many("DarkTransfer.toId"),
    antigravity: p.one("antigravityId"),
    claims: p.many("Claim.userId"),
    heistConducted: p.many("Heist.mastermindId"),
    heistVictim: p.many("Heist.victimId"),
    mines: p.many("Mine.userId"),
    mints: p.many("Mint.userId"),
    ownedFuelCells: p.many("FuelCell.ownerId"),
    transfersFrom: p.many("Transfer.fromId"),
    transfersTo: p.many("Transfer.toId")
  }),
  DarkTransfer: p.createTable({
    id: p.string(),
    fromId: p.string().references("User.id"),
    toId: p.string().references("User.id"),
    amount: p.bigint(),
    timestamp: p.bigint(),
    blocknumber: p.bigint(),
    transactionHash: p.string(),

    // Referenced entities
    from: p.one("fromId"),
    to: p.one("toId")
  }),
  Mine: p.createTable({
    id: p.string(),
    userId: p.string().references("User.id"),
    blocknumber: p.bigint(),
    timestamp: p.bigint(),
    transactionHash: p.string(),
    amount: p.bigint(),
    tokenInvested: p.bigint(),
    token: p.string(),

    user: p.one("userId")
  }),
  Claim: p.createTable({
    id: p.string(),
    nonce: p.bigint(),
    userId: p.string().references("User.id"),
    blocknumber: p.bigint(),
    timestamp: p.bigint(),
    transactionHash: p.string(),
    amount: p.bigint(),

    user: p.one("userId")
  }),
  Antigravity: p.createTable({
    id: p.string(),
    contractAddress: p.string(),
    holderId: p.string().references("User.id"),
    tokenId: p.bigint(),
    blocknumber: p.bigint(),
    timestamp: p.bigint(),
    transactionHash: p.string(),

    holder: p.one("holderId")
  }),
  WishWell: p.createTable({
    id: p.string(),
    contractAddress: p.string(),
    holderId: p.string().references("User.id"),
    tokenId: p.bigint(),
    blocknumber: p.bigint(),
    timestamp: p.bigint(),
    transactionHash: p.string(),

    holder: p.one("holderId")
  }),
  Heist: p.createTable({
    id: p.string(),
    victimId: p.string().references("User.id"),
    mastermindId: p.string().references("User.id"),
    amount: p.bigint(),
    blocknumber: p.bigint(),
    timestamp: p.bigint(),
    transactionHash: p.string(),

    victim: p.one("victimId"),
    mastermind: p.one("mastermindId"),
  }),
  FuelCellContract: p.createTable({
    id: p.string(),
    address: p.string(),
    name: p.string(),
    symbol: p.string(),
    baseUri: p.string(),
    suffix: p.string(),
    totalSupply: p.bigint(),
    totalBurned: p.bigint().optional(),
    mintedTokens: p.many("FuelCell.contractId")
  }),
  Mint: p.createTable({
    id: p.string(),
    userId: p.string().references("User.id"),
    journeyId: p.bigint().optional(),
    blocknumber: p.bigint(),
    timestamp: p.bigint(),
    transactionHash: p.string(),
    amount: p.bigint().optional(),

    fuelcells: p.many("FuelCell.mintBatchId"),
    user: p.one("userId")
  }),
  FuelCell: p.createTable({
    id: p.string(),
    ownerId: p.string().references("User.id"),
    journeyId: p.bigint(),
    tokenId: p.bigint(),
    minterId: p.string().references("User.id"),
    mintTimestamp: p.bigint(),
    mintBlockNumber: p.bigint(),
    mintTransactionHash: p.string(),
    burnTimestamp: p.bigint().optional(),
    burnBlockNumber: p.bigint().optional(),
    burnTransactionHash: p.string().optional(),
    uri: p.string().optional(),
    contractId: p.string().references("FuelCellContract.id"),
    mintBatchId: p.string().references("Mint.id"),
    isUnwrapped: p.boolean(),
    // winningsPruned: [WinningPruned!] @derivedFrom(field: "fuelCell"),
    mintBatch: p.one("mintBatchId"),
    transfers: p.many("Transfer.tokenId"),
    contract: p.one("contractId"),
    owner: p.one("ownerId"),
    minter: p.one("minterId")
  }),
  Jackpot: p.createTable({
    id: p.string(),
    address: p.string(),
    bonus: p.bigint(),
    currentLotteryId: p.bigint(),
    currentJourneyId: p.bigint(),
    totalPayedOut: p.bigint(),
    totalClaimed: p.bigint(),
    // results: [LotteryResult!] @derivedFrom(field: "jackpot"),
    // winnings: [WinningPruned!] @derivedFrom(field: "jackpot")
  }),
  Treasury: p.createTable({
    id: p.string(),
    address: p.string(),
    recentYieldJourneyId: p.bigint(),
    totalYieldPayedOut: p.bigint(),
    totalYieldClaimed: p.bigint(),
    // payouts: [YieldPayout!] @derivedFrom(field: "treasury")
  }),
  YieldPayout: p.createTable({
    id: p.string(),
    // treasury: Treasury!,
    journeyId: p.bigint(),
    givenIn: p.bigint(),
    yieldValue: p.bigint(),
    totalFuelCellsInJourney: p.bigint(),
    amountPerFuelCell: p.bigint(),
    blockNumber: p.bigint(),
    timestamp: p.bigint(),
    transactionHash: p.string(),
  }),
  LotteryResult: p.createTable({
    id: p.string(),
    // jackpot: Jackpot!,
    journeyId: p.bigint(),
    lotteryId: p.bigint(),
    numberOfWinners: p.bigint(),
    payout: p.bigint(),
    payoutPerFuelCell: p.bigint(),
    root: p.string(),
    uri: p.string(),
    blockNumber: p.bigint(),
    timestamp: p.bigint(),
    transactionHash: p.string(),
  }),
  WinningPruned: p.createTable({
    id: p.string(),
    // jackpot: Jackpot!,
    journeyId: p.bigint(),
    lotteryId: p.bigint(),
    // fuelCell: FuelCell!,
    winningAmount: p.bigint(),
    blockNumber: p.bigint(),
    timestamp: p.bigint(),
    transactionHash: p.string(),
  }),
  Transfer: p.createTable({
    id: p.string(),
    tokenId: p.string().references("FuelCell.id"),
    // Empty from is minting
    fromId: p.string().references("User.id"),
    // Empty to is burning
    toId: p.string().references("User.id"),
    timestamp: p.bigint(),
    block: p.bigint(),
    transactionHash: p.string(),

    token: p.one("tokenId"),
    from: p.one("fromId"),
    to: p.one("toId")
  }),
  EvilAddress: p.createTable({
    id: p.string(),
    address: p.string(),
    latestEvilMintJourney: p.bigint(),
    nextFuelCellMintQuantity: p.bigint(),
    recentPruneTimestamp: p.bigint(),
    recentPruneBlockNumber: p.bigint(),
    recentPruneTransactionHash: p.string(),
  
    evilMints: p.many("EvilMint.evilId")
  }),
  EvilMint: p.createTable({
    id: p.string(),
    journeyId: p.bigint(),
    totalMinted: p.bigint(),
    evilId: p.string().references("EvilAddress.id"),
    blockNumber: p.bigint(),
    timestamp: p.bigint(),
    transactionHash: p.string(),

    evil: p.one("evilId")
  }),
  JourneyPhaseManager: p.createTable({
    id: p.string(),
    address: p.string(),
    recentPauseStartTime: p.bigint(),
    totalPauseTime: p.bigint(),
    totalFuelCellsMinted: p.bigint(),
    totalFuelCellsBurned: p.bigint(),
    totalActiveFuelCells: p.bigint(),
    isRaptueAlertActive: p.boolean(),
    isPaused: p.boolean()
  }),
}));