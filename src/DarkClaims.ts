import { ponder } from "@/generated";

ponder.on("DarkClaims:Claimed", async ({ event, context }) => {
  console.log(event.args);
});

ponder.on("DarkClaims:OwnershipTransferred", async ({ event, context }) => {
  console.log(event.args);
});
