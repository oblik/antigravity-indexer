import { ponder } from "@/generated";
import { Inputs } from "./types";
import { generateDarkTransferEntityId, generateUserId } from "./utils/idGenerator";

ponder.on("Dark:AddedHolder", handleAddedHolder);

ponder.on("Dark:AllowlistAdded", handleAllowlistAdded);

ponder.on("Dark:AllowlistRemoved", handleAllowlistRemoved);

ponder.on("Dark:Transfer", handleTransfer);

async function handleAddedHolder({event,context}: Inputs): Promise<void> {
  const { args, log, block, transaction } = event;
  const { db, network, client, contracts } = context;
  const {User: UserEntity, Antigravity: AntigravityEntity} = db;
  // treasury fee update
  const {holder} = args;
  // create user entity if it doesn't exist
  // if user doesn't exist, create a new user
  const userId = generateUserId(holder);
  await UserEntity.upsert({
    id: userId,
    create: {
      address: holder,
      totalMined: 0n,
      isAllowlisted: false,
      isHolderOfDark: true,
      darkxbalance: 0n,
      darkBalance: 0n,
      fuelCellBalance: 0n,
      totalMintedFuelCell: 0n,
    },
    update: {
      isHolderOfDark: true,
    }
  });
}

async function handleAllowlistAdded({event,context}: Inputs): Promise<void> {
  const { args, log, block, transaction } = event;
  const { db, network, client, contracts } = context;
  const {User: UserEntity, Antigravity: AntigravityEntity} = db;
  // treasury fee update
  const {account} = args;
  // create user entity if it doesn't exist
  // if user doesn't exist, create a new user
  const userId = generateUserId(account);
    
  await UserEntity.upsert({
    id: userId,
    create: {
      address: account,
      totalMined: 0n,
      isAllowlisted: true,
      isHolderOfDark: false,
      darkxbalance: 0n,
      darkBalance: 0n,
      fuelCellBalance: 0n,
      totalMintedFuelCell: 0n,
    },
    update: {
      isAllowlisted: true,
    }
  });
}

async function handleAllowlistRemoved({event,context}: Inputs): Promise<void> {
  const { args, log, block, transaction } = event;
  const { db, network, client, contracts } = context;
  const {User: UserEntity, Antigravity: AntigravityEntity} = db;
  // treasury fee update
  const {account} = args;
    // create user entity if it doesn't exist
    // if user doesn't exist, create a new user
    const userId = generateUserId(account);
    await UserEntity.upsert({
      id: userId,
      create: {
        address: account,
        totalMined: 0n,
        isAllowlisted: false,
        isHolderOfDark: false,
        darkxbalance: 0n,
        darkBalance: 0n,
        fuelCellBalance: 0n,
        totalMintedFuelCell: 0n,
      },
      update: {
        isAllowlisted: false,
      }
    });
}

async function handleTransfer({event,context}: Inputs): Promise<void> {
  const { args, log, block, transaction } = event;
  const { db, network, client, contracts } = context;
  const {User: UserEntity, DarkTransfer: DarkTransferEntity} = db;
  // treasury fee update
  const {from, to, amount} = args;

  // if victim doesn't exist, create a new user
  const senderId = generateUserId(from);
  await UserEntity.upsert({
    id: senderId,
    create: {
      address: from,
      totalMined: 0n,
      isAllowlisted: false,
      isHolderOfDark: false,
      darkxbalance: 0n,
      darkBalance: 0n,
      fuelCellBalance: 0n,
      totalMintedFuelCell: 0n,
    },
    update: ({current}) => {
      if(current.darkBalance - amount <= 0n) {
        return {
          isHolderOfDark: false,
          darkBalance: 0n
        }
      }
      return {
        darkBalance: current.darkBalance - amount
      }
    }
  });

  // if mastermind doesn't exist, create a new user
  const receiverId = generateUserId(to);
  await UserEntity.upsert({
    id: receiverId,
    create: {
      address: to,
      totalMined: 0n,
      isAllowlisted: false,
      isHolderOfDark: true,
      darkxbalance: 0n,
      darkBalance: amount,
      fuelCellBalance: 0n,
      totalMintedFuelCell: 0n,
    },
    update: ({current}) => ({
      isHolderOfDark: true,
      darkBalance: current.darkBalance + amount
    })
  });
  
  // create transfer entity
  const transferId = generateDarkTransferEntityId(to, from, log.transactionHash, log.id);
  await DarkTransferEntity.create({
    id: transferId,
    data: {
      fromId: senderId,
      toId: receiverId,
      amount: amount,
      blocknumber: block.number,
      timestamp: block.timestamp,
      transactionHash: log.transactionHash
    }
  });
}

