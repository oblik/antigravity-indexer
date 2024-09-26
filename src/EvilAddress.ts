import { ponder } from "@/generated";

ponder.on("EvilAddress:AdminChanged", async ({ event, context }) => {
  console.log(event.args);
});

ponder.on("EvilAddress:BeaconUpgraded", async ({ event, context }) => {
  console.log(event.args);
});

ponder.on("EvilAddress:EvilMintExecuted", async ({ event, context }) => {
  console.log(event.args);
});

ponder.on("EvilAddress:EvilPruned", async ({ event, context }) => {
  console.log(event.args);
});
