import { defineExtensionMessaging } from "@webext-core/messaging";
import type { GetItemsResult, GetPassiveSkillsResult } from "cn-poe-utils/api";
import type { POE2BuildData } from "./poe2_build";

interface ProtocolMap {
  createPOE1Build(data: {
    items: GetItemsResult;
    passiveSkills: GetPassiveSkillsResult;
  }): string;
  createPOE2Build(data: POE2BuildData): string;
  manageWgItems(data: { shareCode: string }): void;
  openTransItemPage(data: { version: string }): void;
  translatePOE1Item(data: { item: string }): string;
  translatePOE2Item(data: { item: string }): string;
}

export const { sendMessage, onMessage } =
  defineExtensionMessaging<ProtocolMap>();
