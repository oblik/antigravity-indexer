import { ponder } from "@/generated";

ponder.on("Antigravity:Approval", async ({ event, context }) => {
  console.log(event.args);
});

ponder.on("Antigravity:ApprovalForAll", async ({ event, context }) => {
  console.log(event.args);
});

ponder.on(
  "Antigravity:OwnershipHandoverCanceled",
  async ({ event, context }) => {
    console.log(event.args);
  },
);

ponder.on(
  "Antigravity:OwnershipHandoverRequested",
  async ({ event, context }) => {
    console.log(event.args);
  },
);
