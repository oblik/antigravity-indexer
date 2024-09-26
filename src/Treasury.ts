import { ponder } from "@/generated";

ponder.on("Treasury:AdminChanged", async ({ event, context }) => {
  console.log(event.args);
});

ponder.on("Treasury:BeaconUpgraded", async ({ event, context }) => {
  console.log(event.args);
});

ponder.on("Treasury:FuelCellUnwrapped", async ({ event, context }) => {
  console.log(event.args);
});

ponder.on("Treasury:Initialized", async ({ event, context }) => {
  console.log(event.args);
});
