import { ponder } from "@/generated";

ponder.on("Jackpot:AdminChanged", async ({ event, context }) => {
  console.log(event.args);
});

ponder.on("Jackpot:BeaconUpgraded", async ({ event, context }) => {
  console.log(event.args);
});

ponder.on("Jackpot:BonusAdded", async ({ event, context }) => {
  console.log(event.args);
});

ponder.on("Jackpot:Initialized", async ({ event, context }) => {
  console.log(event.args);
});
