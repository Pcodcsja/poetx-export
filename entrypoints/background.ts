import { onMessage } from "../utils/messaging";
import { createPOE1Build, translatePOE1Item } from "@/utils/poe1_build";
import { createPOE2Build, translatePOE2Item } from "@/utils/poe2_build";

export default defineBackground(() => {
  onMessage("createPOE1Build", (message) => {
    return createPOE1Build(message.data);
  });
  onMessage("createPOE2Build", (message) => {
    return createPOE2Build(message.data);
  });
  onMessage("manageWgItems", async (message) => {
    browser.windows.create({
      url: browser.runtime.getURL(
        `/wg_items.html?shareCode=${message.data.shareCode}`,
      ),
      width: 1000,
      height: 600,
      type: "popup",
    });
  });

  onMessage("openTransItemPage", async (message) => {
    browser.windows.create({
      url: browser.runtime.getURL(
        `/trans_item.html?version=${message.data.version}`,
      ),
      width: 1000,
      height: 600,
      type: "popup",
    });
  });

  onMessage("translatePOE1Item", async (message) => {
    return translatePOE1Item(message.data.item);
  });

  onMessage("translatePOE2Item", async (message) => {
    return translatePOE2Item(message.data.item);
  });
});
