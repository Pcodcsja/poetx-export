<script setup lang="ts">
import Button from "@/components/ui/button/Button.vue";
import { profile, POE_SITE_TENCENT } from "@/utils/poe1_api";
import { ref, onMounted } from "vue";
import { browser } from "wxt/browser";
import { sendMessage } from "@/utils/messaging";
import { defaultSettings, Settings, TranslationTarget } from "@/utils/setting";
import { readCharacterData } from "@/utils/character_data";

const POE_FORUM_URL = "https://poe.game.qq.com";
const COOKIE_NAMES = ["POESESSID"];

const cookieStr = ref("");
const translationTarget = ref<TranslationTarget>("POE1");
const characterFile = ref<HTMLInputElement>();
const offlineCode = ref("");
const offlineStatus = ref("");
const importing = ref(false);

async function importCharacter(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = "";
  if (!file) return;
  importing.value = true;
  offlineCode.value = "";
  offlineStatus.value = "";
  try {
    const character = await readCharacterData(file);
    offlineCode.value =
      character.game === "poe1"
        ? await sendMessage("createPOE1Build", character.data)
        : await sendMessage("createPOE2Build", character.data);
  } catch (error) {
    offlineStatus.value =
      error instanceof Error ? error.message : String(error);
  } finally {
    importing.value = false;
  }
}

async function copyOfflineCode() {
  try {
    await navigator.clipboard.writeText(offlineCode.value);
    offlineStatus.value = "已复制 PoB 码";
  } catch {
    offlineStatus.value = "复制失败，可手动选中分享码复制";
  }
}

async function handleCookieCopyBtnClick() {
  try {
    await profile(POE_SITE_TENCENT);
  } catch (e) {
    await browser.tabs.create({ url: "https://poe.game.qq.com/login" });
    return;
  }

  await navigator.clipboard.writeText(cookieStr.value);
}

function handleSettingsBtnClick() {
  browser.runtime.openOptionsPage();
}

async function handleTranslateClick() {
  await sendMessage("openTransItemPage", {
    version: translationTarget.value.toLowerCase(),
  });
}

async function loadCookie() {
  let str = "";
  for (const name of COOKIE_NAMES) {
    const cookie = await browser.cookies.get({ url: POE_FORUM_URL, name });
    if (cookie) {
      str = str + `${name}=${cookie.value};`;
    }
  }

  cookieStr.value = str.substring(0, str.length - 1);
}

async function loadSettings() {
  const values = await browser.storage.local.get(defaultSettings());
  const settings = values as Settings;
  translationTarget.value = settings.tranlationDefaultTarget;
}

onMounted(async () => {
  loadCookie();
  loadSettings();
});
</script>

<template>
  <div class="min-w-50 my-1 ml-1 mr-0.5">
    <div>
      <Button
        class="w-full"
        @click="handleCookieCopyBtnClick"
        variant="outline"
      >
        复制Cookie
      </Button>
    </div>
    <div>
      <Button class="w-full" @click="handleTranslateClick" variant="outline">
        翻译物品
      </Button>
    </div>
    <div class="mt-0.5">
      <input
        ref="characterFile"
        type="file"
        accept=".json,application/json"
        hidden
        @change="importCharacter"
      />
      <Button
        class="w-full"
        variant="outline"
        :disabled="importing"
        @click="characterFile?.click()"
      >
        {{ importing ? "正在生成 PoB 码…" : "从角色文件离线导出" }}
      </Button>
      <template v-if="offlineCode">
        <textarea
          class="my-1 w-full rounded border p-1"
          readonly
          rows="3"
          aria-label="PoB 分享码"
          :value="offlineCode"
        />
        <Button class="w-full" variant="outline" @click="copyOfflineCode"
          >复制 PoB 码</Button
        >
      </template>
      <p v-if="offlineStatus" class="my-1 max-w-64 text-sm" role="status">
        {{ offlineStatus }}
      </p>
    </div>
    <div class="mt-0.5">
      <Button class="w-full" @click="handleSettingsBtnClick" variant="outline">
        设置
      </Button>
    </div>
  </div>
</template>
