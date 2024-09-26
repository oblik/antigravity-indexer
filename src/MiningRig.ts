import { ponder } from "@/generated";

ponder.on("MiningRig:MerkleRootUpdated", async ({ event, context }) => {
  console.log(event.args);
});

ponder.on("MiningRig:Mined", async ({ event, context }) => {
  console.log(event.args);
});

ponder.on("MiningRig:OwnershipTransferred", async ({ event, context }) => {
  console.log(event.args);
});
