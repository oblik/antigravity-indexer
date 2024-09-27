import { ponder } from "@/generated";
import { Inputs } from "./types";
import { generateClaimId, generateUserId } from "./utils/idGenerator";

ponder.on("DarkClaims:Claimed", handleClaimed);

ponder.on("DarkClaims:OwnershipTransferred", async ({ event, context }) => {
  // console.log(event.args);
});


async function handleClaimed({event,context}: Inputs): Promise<void> {
  const { args, log, block, transaction } = event;
  const { db, network, client, contracts } = context;
  const {User: UserEntity, Claim: ClaimEntity} = db;
  // treasury fee update
  const {user, nonce, amount} = args;
  // create user if doesn't exist
  // if user doesn't exist, create a new user
  const userId = generateUserId(user);
  await UserEntity.upsert({
    id: userId,
    create: {
      address: user,
      totalMined: 0n,
      isAllowlisted: false,
      isHolderOfDark: false,
      darkxbalance: 0n,
      darkBalance: 0n, // dark balance is updated using handleDarkTransfer
      fuelCellBalance: 0n,
      totalMintedFuelCell: 0n,
    },
    update: {}
  });

  // create claim if doesn't exist
  const claimId = generateClaimId(user, nonce);
  await ClaimEntity.create({
    id: claimId,
    data: {
      nonce: nonce,
      userId: userId,
      blocknumber: block.number,
      timestamp: block.timestamp,
      transactionHash: log.transactionHash,
      amount: amount
    }
  });
}
