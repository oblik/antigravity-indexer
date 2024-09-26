import { ponder } from "@/generated";

ponder.on("DarkX:Approval", async ({ event, context }) => {
  console.log(event.args);
});

ponder.on("DarkX:GalacticHeistAlert", async ({ event, context }) => {
  console.log(event.args);
});

ponder.on("DarkX:Transfer", async ({ event, context }) => {
  console.log(event.args);
});
