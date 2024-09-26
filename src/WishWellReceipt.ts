import { ponder } from "@/generated";

ponder.on("WishWellReceipt:Approval", async ({ event, context }) => {
  console.log(event.args);
});

ponder.on("WishWellReceipt:ApprovalForAll", async ({ event, context }) => {
  console.log(event.args);
});

ponder.on(
  "WishWellReceipt:OwnershipHandoverCanceled",
  async ({ event, context }) => {
    console.log(event.args);
  },
);

ponder.on(
  "WishWellReceipt:OwnershipHandoverRequested",
  async ({ event, context }) => {
    console.log(event.args);
  },
);
