<script setup lang="ts">
import {
  getEquipments,
  getJewels,
  getRoleInfo,
  getSkills,
  getTalentTree,
} from "@/utils/poe2_wg_api";
import { ref, shallowRef } from "vue";
import { sendMessage } from "@/utils/messaging";
import { CustomItems } from "../wg_items/App.vue";
import { transformTypes } from "@/utils/poe2_types";
import type { POE2BuildData } from "@/utils/poe2_build";
import { saveCharacterData } from "@/utils/character_data";

const pattern = new RegExp("/helper/poe2/[^/]*#/share/([^/?]+)");

function getShareCode(): string | undefined {
  const match = pattern.exec(window.location.href);
  if (match) {
    const shareCode = decodeURIComponent(match[1]);
    return shareCode;
  }
  return undefined;
}

async function loadCustomItems(
  shareCode: string,
): Promise<CustomItems | undefined> {
  const storageKey = `customItems:${shareCode}`;
  const result = await browser.storage.local.get(storageKey);
  if (result[storageKey]) {
    return result[storageKey] as CustomItems;
  }
  return undefined;
}

function customItemsToCustomData(
  customItems: CustomItems,
): transformTypes.CustomData {
  const customData: transformTypes.CustomData = {
    items: [],
    jewels: {},
  };

  for (const [key, value] of Object.entries(customItems.items)) {
    const item: transformTypes.CustomItem = {
      isText: value.isText,
      isJSON: value.isJSON,
    };

    if (item.isJSON) {
      item.json = JSON.parse(value.data);
    } else if (item.isText) {
      item.text = value.data;
    }

    customData.items[Number(key)] = item;
  }

  for (const [key, value] of Object.entries(customItems.socketedItems)) {
    if (value !== null) {
      customData.jewels[Number(key)] = value;
    }
  }

  return customData;
}

async function getCustomData(
  shareCode: string,
): Promise<transformTypes.CustomData> {
  const customItems = await loadCustomItems(shareCode);
  if (customItems) {
    return customItemsToCustomData(customItems);
  }
  return {
    items: [],
    jewels: {},
  };
}

async function getCharacterData(): Promise<POE2BuildData> {
  const shareCode = getShareCode();
  if (!shareCode) {
    throw new Error("无法从当前链接中提取分享码");
  }

  const roleInfo = await getRoleInfo(shareCode);
  const roleId = roleInfo.role?.role_id;
  if (!roleId) {
    throw new Error("WeGame 未返回角色信息，请检查分享链接是否有效。");
  }

  const [equipments, jewels, skills, talentTree] = await Promise.all([
    getEquipments(roleId, shareCode),
    getJewels(roleId, shareCode),
    getSkills(roleId, shareCode),
    getTalentTree(roleId, shareCode),
  ]);

  return {
    role: { level: roleInfo.role.level, class_name: roleInfo.role.class_name },
    equipments: equipments.equipments,
    jewel_data: jewels.jewel_data,
    skills: skills.skills,
    talent_tree: talentTree.talent_tree,
    customItems: useCustomItems.value
      ? await getCustomData(shareCode)
      : undefined,
  };
}

const loading = ref(false);
const useCustomItems = ref(true);
const code = ref("");
const characterData = shallowRef<POE2BuildData>();

async function handleCustomItemsClick() {
  const shareCode = await getShareCode();
  if (!shareCode) {
    alert("无法从当前链接中提取分享码");
    return;
  }
  await sendMessage("manageWgItems", {
    shareCode: shareCode,
  });
}

async function handleCreateClick() {
  loading.value = true;
  code.value = "";
  characterData.value = undefined;
  try {
    const data = await getCharacterData();
    characterData.value = data;
    const payload = await sendMessage("createPOE2Build", data);
    code.value = payload;
    try {
      await navigator.clipboard.writeText(payload);
    } catch (e) {
      console.warn("Clipboard write failed:", e);
    }
  } catch (err: any) {
    const message = err?.message ?? String(err);
    window.alert(message);
  } finally {
    loading.value = false;
  }
}

async function handleCopy() {
  navigator.clipboard.writeText(code.value);
}

function handleSaveCharacter() {
  if (characterData.value)
    saveCharacterData({ game: "poe2", data: characterData.value });
}

async function handleTranslateClick() {
  await sendMessage("openTransItemPage", {
    version: "poe2",
  });
}
</script>

<template>
  <span class="line-container">
    <span>
      <button @click="handleTranslateClick">物品翻译</button>
    </span>
  </span>
  <span class="line-container">
    <span>
      <button @click="handleCustomItemsClick" :disabled="loading">
        自定义物品
      </button>
      <input
        type="checkbox"
        style="transform: scale(1.5); margin-left: 10px; margin-right: 20px"
        title="使用自定义物品"
        v-model="useCustomItems"
        :disabled="loading"
      />
    </span>
    <button @click="handleCreateClick" :disabled="loading">导出POB</button>
  </span>
  <span class="line-container">
    <input disabled maxlength="50" :value="code" />
    <button @click="handleCopy" :disabled="code.length === 0">复制</button>
    <button @click="handleSaveCharacter" :disabled="!characterData">
      保存角色数据
    </button>
  </span>
</template>

<style scoped>
.line-container {
  display: flex;
  margin: 3px 0;
  min-height: 25px;
  justify-content: space-between;
}

.line-container select {
  min-height: 25px;
  margin-right: 4px;
  min-width: 100px;
}

.line-container input {
  margin-right: 4px;
}
</style>
