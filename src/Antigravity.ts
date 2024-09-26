import { ponder } from "@/generated";
import { Inputs } from "./types";
import { generateAntigravityId, generateUserId } from "./utils/idGenerator";

ponder.on("Antigravity:Transfer", handleAntigravityTransfer);

async function handleAntigravityTransfer({event,context}: Inputs): Promise<void> {
  const { args, log, block, transaction } = event;
  const { db, network, client, contracts } = context;
  const {User: UserEntity, Antigravity: AntigravityEntity} = db;
  // treasury fee update
  const {from, to, id} = args;

  // create antigravity entity
  // the NFT is a soulbound NFT, hence the ownership will never change
  const antigravityid = generateAntigravityId(contracts.Antigravity.address, id);
  console.log(antigravityid);

  // if user doesn't exist, create a new user
  const userId = generateUserId(to);
  console.log(userId);
  await UserEntity.upsert({
    id: userId,
    create: {
      address: to,
      totalMined: 0n,
      isAllowlisted: false,
      isHolderOfDark: false,
      darkxbalance: 0n,
      darkBalance: 0n,
      fuelCellBalance: 0n,
      totalMintedFuelCell: 0n,
      antigravityId: antigravityid
    },
    update: {
      antigravityId: antigravityid
    }
  });

  await AntigravityEntity.create({
    id: antigravityid,
    data: {
      contractAddress: contracts.Antigravity.address,
      holderId: userId,
      tokenId: id,
      blocknumber: block.number,
      timestamp: block.timestamp,
      transactionHash: transaction.hash
    }
  });
}
