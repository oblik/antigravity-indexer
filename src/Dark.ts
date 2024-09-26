import { ponder } from "@/generated";

ponder.on("Dark:AddedHolder", async ({ event, context }) => {
  console.log(event.args);
});

ponder.on("Dark:AllowlistAdded", async ({ event, context }) => {
  console.log(event.args);
});

ponder.on("Dark:AllowlistRemoved", async ({ event, context }) => {
  console.log(event.args);
});

ponder.on("Dark:Approval", async ({ event, context }) => {
  console.log(event.args);
});
