import { ponder } from "@/generated";
import { generateJPMId } from "./utils/idGenerator";
import { Inputs } from "./types";

ponder.on("JourneyPhaseManager:RaptureAlertDetectionActivated", handleRaptureAlertDetectionActivated);

ponder.on("JourneyPhaseManager:Paused", handlePaused);

ponder.on("JourneyPhaseManager:Unpaused", handleUnpaused);

ponder.on("JourneyPhaseManager:Initialized", handleInitialized);

async function handlePaused({event,context}: Inputs): Promise<void> {
  const { args, log, block, transaction } = event;
  const { db, network, client, contracts } = context;
  const {
    JourneyPhaseManager: JourneyPhaseManagerEntity
  } = db;
  // treasury fee update

  // first fetch baseURI and suffix
  let totalPausedTime;
  let recentPauseStartTime;

  // call baseURI and suffix functions in multicall for efficiency
  const result = await client.multicall({
    contracts: [
      {
        abi: contracts.JourneyPhaseManager.abi,
        address: contracts.JourneyPhaseManager.address,
        functionName: "totalPausedTime"
      },
      {
        abi: contracts.JourneyPhaseManager.abi,
        address: contracts.JourneyPhaseManager.address,
        functionName: "recentPauseStartTime"
      }
    ],
    multicallAddress: "0xca11bde05977b3631167028862be2a173976ca11"
  });

  // handle errors
  if(result[0].status == "failure") {
    totalPausedTime = 0n;
  } else {
    totalPausedTime = result[0].result;
  }
  if (result[1].status == "failure") {
    recentPauseStartTime = 0n;
  } else {
    recentPauseStartTime = result[1].result;
  }

  const jpmId = generateJPMId(contracts.JourneyPhaseManager.address);
  await JourneyPhaseManagerEntity.update({
    id: jpmId,
    data: {
      totalPauseTime: totalPausedTime,
      recentPauseStartTime: recentPauseStartTime,
      isPaused: true
    }
  });
}

async function handleUnpaused({event,context}: Inputs): Promise<void> {
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
  
  // first fetch baseURI and suffix
  let totalPausedTime;
  let recentPauseStartTime;

  // call baseURI and suffix functions in multicall for efficiency
  const result = await client.multicall({
    contracts: [
      {
        abi: contracts.JourneyPhaseManager.abi,
        address: contracts.JourneyPhaseManager.address,
        functionName: "totalPausedTime"
      },
      {
        abi: contracts.JourneyPhaseManager.abi,
        address: contracts.JourneyPhaseManager.address,
        functionName: "recentPauseStartTime"
      }
    ],
    multicallAddress: "0xca11bde05977b3631167028862be2a173976ca11"
  });

  // handle errors
  if(result[0].status == "failure") {
    totalPausedTime = 0n;
  } else {
    totalPausedTime = result[0].result;
  }
  if (result[1].status == "failure") {
    recentPauseStartTime = 0n;
  } else {
    recentPauseStartTime = result[1].result;
  }

  const jpmId = generateJPMId(contracts.JourneyPhaseManager.address);
  await JourneyPhaseManagerEntity.update({
    id: jpmId,
    data: {
      totalPauseTime: totalPausedTime,
      recentPauseStartTime: recentPauseStartTime,
      isPaused: false
    }
  });

}

async function handleInitialized({event,context}: Inputs): Promise<void> {
  const { args, log, block, transaction } = event;
  const { db, network, client, contracts } = context;
  const {
    JourneyPhaseManager: JourneyPhaseManagerEntity
  } = db;

  const jpmId = generateJPMId(contracts.JourneyPhaseManager.address);
  await JourneyPhaseManagerEntity.create({
    id: jpmId,
    data: {
      address: contracts.JourneyPhaseManager.address,
      recentPauseStartTime: 0n,
      totalPauseTime: 0n,
      isPaused: false,
      isRaptueAlertActive: false,
      totalFuelCellsMinted: 0n,
      totalFuelCellsBurned: 0n,
      totalActiveFuelCells: 0n
    }
  });
}

async function handleRaptureAlertDetectionActivated({event,context}: Inputs): Promise<void> {
  const { args, log, block, transaction } = event;
  const { db, network, client, contracts } = context;
  const {
    JourneyPhaseManager: JourneyPhaseManagerEntity,
  } = db;

  const jpmId = generateJPMId(contracts.JourneyPhaseManager.address);
  await JourneyPhaseManagerEntity.update({
    id: jpmId,
    data: {
      isRaptueAlertActive: true
    }
  });
}
