import { ponder } from "@/generated";

ponder.on("FuelCell:AdminChanged", async ({ event, context }) => {
  console.log(event.args);
});

ponder.on("FuelCell:Approval", async ({ event, context }) => {
  console.log(event.args);
});

ponder.on("FuelCell:ApprovalForAll", async ({ event, context }) => {
  console.log(event.args);
});

ponder.on("FuelCell:BeaconUpgraded", async ({ event, context }) => {
  console.log(event.args);
});
