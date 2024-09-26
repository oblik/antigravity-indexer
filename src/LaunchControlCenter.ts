import { ponder } from "@/generated";

ponder.on("LaunchControlCenter:AdminChanged", async ({ event, context }) => {
  // console.log(event.args);
});

ponder.on("LaunchControlCenter:BeaconUpgraded", async ({ event, context }) => {
  // console.log(event.args);
});

ponder.on("LaunchControlCenter:FuelCellsMinted", handleFuelCellsMinted);

ponder.on("LaunchControlCenter:Initialized", async ({ event, context }) => {
  // console.log(event.args);
});


export function handleFuelCellsMinted({event,context}: Inputs): Promise<void> {
  // this is handled by FuelCell.handleMintFuelCells
}
