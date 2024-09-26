import { ponder } from "@/generated";
import { Inputs } from "./types";
import { generateHeistId, generateUserId } from "./utils/idGenerator";

ponder.on("DarkX:GalacticHeistAlert", handleGalacticHeistAlert);

ponder.on("DarkX:Transfer", handleTransfer);

async function handleGalacticHeistAlert({event,context}: Inputs): Promise<void> {
  const { args, log, block, transaction } = event;
  const { db, network, client, contracts } = context;
  const {User: UserEntity, Heist: HeistEntity} = db;
  // treasury fee update
  const {from, to, amount} = args;
  // create both users if don't exist

  // if mastermind doesn't exist, create a new user
  const mastermindId = generateUserId(to);
  await UserEntity.upsert({
    id: mastermindId,
    create: {
      address: to,
      totalMined: 0n,
      isAllowlisted: false,
      isHolderOfDark: false,
      darkxbalance: amount,
      darkBalance: 0n,
      fuelCellBalance: 0n,
      totalMintedFuelCell: 0n,
    },
    update: ({current}) => ({
      darkxbalance: current.darkxbalance + amount,
    })
  });

  // if victim doesn't exist, create a new user
  const victimId = generateUserId(from);
  await UserEntity.upsert({
    id: victimId,
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
    update: ({current}) => ({
      darkxbalance: current.darkxbalance - amount,
    })
  });

  // create heist entity
  const heistId = generateHeistId(to, from, transaction.hash);
  await HeistEntity.create({
    id: heistId,
    data: {
      victimId,
      mastermindId,
      amount: amount,
      blocknumber: block.number,
      timestamp: block.timestamp,
      transactionHash: transaction.hash,
    }
  });
}

async function handleTransfer({event,context}: Inputs): Promise<void> {// create both users if don't exist
  const { args, log, block, transaction } = event;
  const { db, network, client, contracts } = context;
  const {User: UserEntity, Heist: HeistEntity} = db;
  // treasury fee update
  const {from, to, amount} = args;

  // if mastermind doesn't exist, create a new user
  const receiverId = generateUserId(to);
  await UserEntity.upsert({
    id: receiverId,
    create: {
      address: to,
      totalMined: 0n,
      isAllowlisted: false,
      isHolderOfDark: false,
      darkxbalance: amount,
      darkBalance: 0n,
      fuelCellBalance: 0n,
      totalMintedFuelCell: 0n,
    },
    update: ({current}) => ({
      darkxbalance: current.darkxbalance + amount,
    })
  });

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
    update: ({current}) => ({
      darkxbalance: current.darkxbalance - amount,
    })
  });
}
