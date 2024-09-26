import { ponder } from "@/generated";
import { Inputs } from "./types";
import { generateUserId, generateWishWellId } from "./utils/idGenerator";

ponder.on("WishWellReceipt:Transfer", handleWishWellReceiptTransfer);

async function handleWishWellReceiptTransfer({event,context}: Inputs): Promise<void> {
  const { args, log, block, transaction } = event;
  const { db, network, client, contracts } = context;
  const {User: UserEntity, WishWell: WishWellEntity} = db;
  // treasury fee update
  const {from, to, id} = args;

  // create wishWell entity
  // the NFT is a soulbound NFT, hence the ownership will never change
  const wishWellid = generateWishWellId(contracts.WishWellReceipt.address, id);

  // if user doesn't exist, create a new user
  const userId = generateUserId(to);
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
      wishwellId: wishWellid
    },
    update: {
      wishwellId: wishWellid
    }
  });

  await WishWellEntity.create({
    id: wishWellid,
    data: {
      contractAddress: contracts.WishWellReceipt.address,
      holderId: userId,
      tokenId: id,
      blocknumber: block.number,
      timestamp: block.timestamp,
      transactionHash: transaction.hash
    }
  });
}
