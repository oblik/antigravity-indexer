import { ponder } from "@/generated";
import { Inputs } from "./types";
import { generateFuelCellContractId, generateFuelCellId, generateJPMId, generateMintId, generateTransferId, generateUserId } from "./utils/idGenerator";
import { zeroAddress } from "viem";

ponder.on("FuelCell:Transfer", handleTransfer);

ponder.on("FuelCell:MintFuelCells", handleMintFuelCells);

async function handleMintFuelCells({event,context}: Inputs): Promise<void> {
  const { args, log, block, transaction } = event;
  const { db, network, client, contracts } = context;
  const {
    User: UserEntity,
    JourneyPhaseManager: JourneyPhaseManagerEntity,
    Mint: MintEntity,
    Transfer: TransferEntity,
    FuelCell: FuelCellEntity,
    FuelCellContract: FuelCellContractEntity
  } = db;
  // treasury fee update
  const {to, journeyId, startTokenId, lastTokenId} = args;
  const quantity = lastTokenId - startTokenId + 1n;

  // create both users if don't exist
  let previousOwnerId = generateUserId(zeroAddress);
  let newOwnerId = generateUserId(to);
  let contractId = generateFuelCellContractId(contracts.FuelCell.address);

  // create zero address account
  await UserEntity.upsert({
    id: newOwnerId,
    create: {
      address: zeroAddress,
      totalMined: 0n,
      isAllowlisted: false,
      isHolderOfDark: false,
      darkxbalance: 0n,
      darkBalance: 0n,
      fuelCellBalance: 0n,
      totalMintedFuelCell: 0n,
    },
    update: {}
  });

  // create or update user with new owner's fuel cell balance
  await UserEntity.upsert({
    id: newOwnerId,
    create: {
      address: to,
      totalMined: 0n,
      isAllowlisted: false,
      isHolderOfDark: false,
      darkxbalance: 0n,
      darkBalance: 0n,
      fuelCellBalance: quantity,
      totalMintedFuelCell: 0n,
    },
    update: ({current}) => ({
      fuelCellBalance: current.fuelCellBalance + quantity
    })
  });

  // add contract entity

  // first fetch baseURI and suffix
  let baseUri;
  let suffix;

  // call baseURI and suffix functions in multicall for efficiency
  const result = await client.multicall({
    contracts: [
      {
        abi: contracts.FuelCell.abi,
        address: contracts.FuelCell.address,
        functionName: "baseURI"
      },
      {
        abi: contracts.FuelCell.abi,
        address: contracts.FuelCell.address,
        functionName: "suffix"
      }
    ],
    multicallAddress: "0xca11bde05977b3631167028862be2a173976ca11"
  });

  // handle errors
  if(result[0].status == "failure") {
    baseUri = "";
  } else {
    baseUri = result[0].result;
  }
  if (result[1].status == "failure") {
    suffix = "";
  } else {
    suffix = result[1].result;
  }

  // create contract entity in db
  await FuelCellContractEntity.upsert({
    id: contractId,
    create: {
      address: contracts.FuelCell.address,
      name: "FuelCell",
      symbol: "FUEL",
      baseUri: baseUri,
      suffix: suffix,
      totalSupply: quantity,
      totalBurned: 0n
    },
    update: ({current}) => ({
      totalSupply: current.totalSupply + quantity,
    })
  });

  // create Mint entity
  let mintId = generateMintId(transaction.hash, to);
  await MintEntity.create({
    id: mintId,
    data: {
      userId: newOwnerId,
      journeyId: journeyId,
      amount: quantity,
      blocknumber: event.block.number,
      timestamp: event.block.timestamp,
      transactionHash: event.transaction.hash,
    }
  });

  // update JPM to record new mint
  let jpmId = generateJPMId(contracts.JourneyPhaseManager.address);
  await JourneyPhaseManagerEntity.update({
    id: jpmId,
    data: ({current}) => ({
      totalFuelCellsMinted: current.totalFuelCellsMinted + quantity,
      totalActiveFuelCells: current.totalActiveFuelCells + quantity,
    })
  });

  // Add FuelCell tokens
  await FuelCellEntity.createMany({
    data: Array.from({length: parseInt(quantity.toString())}, (_, i) => {
      const fuelCellTokenId = startTokenId + BigInt(i);
      return {
        id: generateFuelCellId(contracts.FuelCell.address, fuelCellTokenId),
        ownerId: newOwnerId,
        minterId: newOwnerId,
        tokenId: fuelCellTokenId,
        journeyId: journeyId,
        mintTimestamp: block.timestamp,
        mintBlockNumber: block.number,
        mintTransactionHash: transaction.hash,
        mintBatchId: mintId,
        isUnwrapped: false,
        uri: `${baseUri}/${fuelCellTokenId.toString()}${suffix}`,
        contractId: contractId
      }
    })
  });
  
  // create transfer entity
  await TransferEntity.createMany({
    data: Array.from({length: parseInt(quantity.toString())}, (_, i) => {
      const fuelCellTokenId = startTokenId + BigInt(i);
      return {
        id: generateTransferId( transaction.hash, fuelCellTokenId),
        tokenId: generateFuelCellId(contracts.FuelCell.address, fuelCellTokenId),
        fromId: previousOwnerId,
        toId: newOwnerId,
        timestamp: block.timestamp,
        block: block.number,
        transactionHash: transaction.hash
      }
    })
  });
}

async function handleTransfer({event,context}: Inputs): Promise<void> {
  const { args, log, block, transaction } = event;
  const { db, network, client, contracts } = context;
  const {User: UserEntity, FuelCell: FuelCellEntity, Transfer: TransferEntity} = db;
  // treasury fee update
  const {from, to, tokenId} = args;

  // ignore Mints, only track transfer
  if(from == zeroAddress) {
    return;
  }

  let newOwnerId = generateUserId(to);
  let previousOwnerId = generateUserId(from);
  let fuelCellId = generateFuelCellId(contracts.FuelCell.address, tokenId);
  let transferId = generateTransferId(transaction.hash, tokenId);

  // create or update user to deduct the fuel cell transfer
  await UserEntity.upsert({
    id: previousOwnerId,
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
      fuelCellBalance: current.fuelCellBalance - 1n
    })
  });

  // create or update user with new owner's fuel cell balance
  await UserEntity.upsert({
    id: newOwnerId,
    create: {
      address: to,
      totalMined: 0n,
      isAllowlisted: false,
      isHolderOfDark: false,
      darkxbalance: 0n,
      darkBalance: 0n,
      fuelCellBalance: 1n,
      totalMintedFuelCell: 0n,
    },
    update: ({current}) => ({
      fuelCellBalance: current.fuelCellBalance + 1n
    })
  });

  // update owner
  await FuelCellEntity.update({
    id: fuelCellId,
    data: {
      ownerId: newOwnerId
    }
  });

  // create transfer entity
  await TransferEntity.create({
    id: transferId,
    data: {
      tokenId: fuelCellId,
      fromId: previousOwnerId,
      toId: newOwnerId,
      timestamp: block.timestamp,
      block: block.number,
      transactionHash: transaction.hash,
    }
  });
}
