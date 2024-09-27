import { ponder } from "@/generated";
import { generateJPMId } from "./utils/idGenerator";
import { Inputs } from "./types";

ponder.on("JourneyPhaseManager:RaptureAlertDetectionActivated", handleRaptureAlertDetectionActivated);

ponder.on("JourneyPhaseManager:Paused", handlePaused);

ponder.on("JourneyPhaseManager:Unpaused", handleUnpaused);

ponder.on("JourneyPhaseManager:Initialized", handleInitialized);

ponder.on("JourneyUpdateOnInterval:block", handleJourneyBlock);

async function handleJourneyBlock({event,context}: Inputs): Promise<void> {
  const { block } = event;
  const { db, network, client, contracts } = context;
  const {
    JourneyPhaseManager: JourneyPhaseManagerEntity
  } = db;

  let currentJourneyId;
  let currentPhaseId;
  let nextJourneyStartTime;
  let nextPhaseStartTime;

  const result = await client.multicall({
    contracts: [
      {
        abi: contracts.JourneyPhaseManager.abi,
        address: contracts.JourneyPhaseManager.address,
        functionName: "currentJourney"
      },
      {
        abi: contracts.JourneyPhaseManager.abi,
        address: contracts.JourneyPhaseManager.address,
        functionName: "currentPhase"
      },
      {
        abi: contracts.JourneyPhaseManager.abi,
        address: contracts.JourneyPhaseManager.address,
        functionName: "getNextJourneyTimestamp"
      },
      {
        abi: contracts.JourneyPhaseManager.abi,
        address: contracts.JourneyPhaseManager.address,
        functionName: "getNextPhaseTimestamp"
      }
    ],
    multicallAddress: "0xca11bde05977b3631167028862be2a173976ca11"
  });

  if(result[0].status == "failure" || result[1].status == "failure" || result[2].status == "failure" || result[3].status == "failure") {
    console.log({
      error0: result[0].error,
      error1: result[1].error,
      error2: result[2].error,
      error3: result[3].error,
    })
    console.log(`Call to either of the function Failed currentJourney(), currentPhase(), getNextJourneyTimestamp(), getNextPhaseTimestamp()`);
    return;
  }

  currentJourneyId = result[0].result;
  currentPhaseId = result[1].result;
  nextJourneyStartTime = result[2].result;
  nextPhaseStartTime = result[3].result;

  const jpmId = generateJPMId(contracts.JourneyPhaseManager.address);
  try {
    await JourneyPhaseManagerEntity.upsert({
      id: jpmId,
      create: {
        address: contracts.JourneyPhaseManager.address,
        currentJourneyId: currentJourneyId,
        currentPhaseId: currentPhaseId,
        nextJourneyId: currentJourneyId + 1n,
        nextPhaseId: currentPhaseId + 1n,
        nextJourneyStartTime: nextJourneyStartTime,
        nextPhaseStartTime: nextPhaseStartTime,
        recentPauseStartTime: 0n,
        totalPauseTime: 0n,
        isPaused: false,
        isRaptueAlertActive: false,
        totalFuelCellsMinted: 0n,
        totalFuelCellsBurned: 0n,
        totalActiveFuelCells: 0n
      },
      update: {
        currentJourneyId: currentJourneyId,
        currentPhaseId: currentPhaseId,
        nextJourneyId: currentJourneyId + 1n,
        nextPhaseId: currentPhaseId + 1n,
        nextJourneyStartTime: nextJourneyStartTime,
        nextPhaseStartTime: nextPhaseStartTime
      }
    });
  } catch (error) {
    console.log(`Error updating JourneyPhaseManager Entity.`);
    console.log(error);
  }
}

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
    console.log(result[0].error);
    console.log("Error occurrent at event:");
    console.log(event);
    throw Error("Call to JPM.totalPausedTime() failed");
  } else {
    totalPausedTime = result[0].result;
  }
  if (result[1].status == "failure") {
    console.log(result[1].error);
    console.log("Error occurrent at event:");
    console.log(event);
    throw Error("Call to JPM.recentPauseStartTime() failed");
  } else {
    recentPauseStartTime = result[1].result;
  }

  const jpmId = generateJPMId(contracts.JourneyPhaseManager.address);
  console.log({
    jpmId,
    totalPausedTime,
    recentPauseStartTime
  })
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
  console.log(`Calling Handle Initialized for JPM`);
  console.log(`Calling Handle Initialized for JPM`);
  console.log(`Calling Handle Initialized for JPM`);
  console.log(`Calling Handle Initialized for JPM`);
  console.log(`Calling Handle Initialized for JPM`);
  console.log(`Calling Handle Initialized for JPM`);
  const { args, log, block, transaction } = event;
  const { db, network, client, contracts } = context;
  const {
    JourneyPhaseManager: JourneyPhaseManagerEntity
  } = db;

  let nextJourneyStartTime;
  let nextPhaseStartTime;

  const result = await client.multicall({
    contracts: [
      {
        abi: contracts.JourneyPhaseManager.abi,
        address: contracts.JourneyPhaseManager.address,
        functionName: "getNextJourneyTimestamp"
      },
      {
        abi: contracts.JourneyPhaseManager.abi,
        address: contracts.JourneyPhaseManager.address,
        functionName: "getNextPhaseTimestamp"
      }
    ],
    multicallAddress: "0xca11bde05977b3631167028862be2a173976ca11"
  });

  if(result[0].status == "failure" || result[1].status == "failure") {
    console.log(`Call to either of the function jailed getNextJourneyTimestamp(), getNextPhaseTimestamp()`);
    nextJourneyStartTime = -1n;
    nextPhaseStartTime = -1n;
  } else {
    nextJourneyStartTime = result[0].result;
    nextPhaseStartTime = result[1].result;
  }

  const jpmId = generateJPMId(contracts.JourneyPhaseManager.address);
  await JourneyPhaseManagerEntity.upsert({
    id: jpmId,
    create: {
      address: contracts.JourneyPhaseManager.address,
      currentJourneyId: 1n,
      currentPhaseId: 1n,
      nextJourneyId: 2n,
      nextPhaseId: 2n,
      nextJourneyStartTime: nextJourneyStartTime,
      nextPhaseStartTime: nextPhaseStartTime,
      recentPauseStartTime: 0n,
      totalPauseTime: 0n,
      isPaused: false,
      isRaptueAlertActive: false,
      totalFuelCellsMinted: 0n,
      totalFuelCellsBurned: 0n,
      totalActiveFuelCells: 0n
    },
    update: {}
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
