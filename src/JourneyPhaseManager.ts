import { ponder } from "@/generated";

ponder.on("JourneyPhaseManager:AdminChanged", async ({ event, context }) => {
  console.log(event.args);
});

ponder.on("JourneyPhaseManager:BeaconUpgraded", async ({ event, context }) => {
  console.log(event.args);
});

ponder.on("JourneyPhaseManager:FuelCellUpdated", async ({ event, context }) => {
  console.log(event.args);
});

ponder.on("JourneyPhaseManager:Initialized", async ({ event, context }) => {
  console.log(event.args);
});
