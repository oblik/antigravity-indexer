import { ponder } from "@/generated";
import { Inputs } from "./types";
import { generateMineId, generateUserId } from "./utils/idGenerator";

ponder.on("MiningRig:MerkleRootUpdated", async ({ event, context }) => {
  // console.log(event.args);
});

ponder.on("MiningRig:Mined", handleMined);

ponder.on("MiningRig:OwnershipTransferred", async ({ event, context }) => {
  // console.log(event.args);
});


async function handleMined({event,context}: Inputs): Promise<void> {
  const { args, log, block, transaction } = event;
  const { db, network, client, contracts } = context;
  const {User: UserEntity, Mine: MineEntity} = db;
  // treasury fee update
  const {userAddress, nonce, amount, tokenInvested, token} = args;
  // create user entity if it doesn't exist
  // if user doesn't exist, create a new user
  const userId = generateUserId(userAddress);
  await UserEntity.upsert({
    id: userId,
    create: {
      address: userAddress,
      totalMined: amount,
      isAllowlisted: false,
      isHolderOfDark: false,
      darkxbalance: 0n, // darkx balance is updated using handleDarkTransfer
      darkBalance: 0n,
      fuelCellBalance: 0n,
      totalMintedFuelCell: 0n,
    },
    update: ({current}) => ({
      totalMined: current.totalMined + amount,
    })
  })
  // create mine entity if it doesn't exist
  const mineId = generateMineId(userAddress, nonce);
  await MineEntity.create({
    id: mineId,
    data: {
      userId: userId,
      blocknumber: event.block.number,
      timestamp: event.block.timestamp,
      transactionHash: log.transactionHash,
      amount,
      tokenInvested,
      token,
    }
  });
}

