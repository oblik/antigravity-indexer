import { ponder } from "@/generated";

ponder.on("LaunchControlCenter:AdminChanged", async ({ event, context }) => {
  console.log(event.args);
});

ponder.on("LaunchControlCenter:BeaconUpgraded", async ({ event, context }) => {
  console.log(event.args);
});

ponder.on("LaunchControlCenter:FuelCellsMinted", async ({ event, context }) => {
  console.log(event.args);
});

ponder.on("LaunchControlCenter:Initialized", async ({ event, context }) => {
  console.log(event.args);
});
