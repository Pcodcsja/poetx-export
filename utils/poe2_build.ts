import { browser } from "wxt/browser";
import type {
  BuildJson,
  CalculateBuildRequest,
} from "../vendor/pobr/api-types";
import {
  decodeBuildFileJson,
  encodeBuildJson,
  importTradeItemsJson,
  initStagedData,
  initSync,
  parseLocalizedLines,
  schemaVersion,
  stageDataFile,
} from "../vendor/pobr/pobr_wasm.js";
import type { transformTypes } from "./poe2_types";

export interface POE2BuildData {
  role: { level: number; class_name: string };
  equipments: unknown[];
  talent_tree: { hashes: number[]; quest_stats: string[] };
  jewel_data: string;
  skills: unknown[];
  customItems?: transformTypes.CustomData;
}

interface ItemNames {
  bases: Map<string, string>;
  words: Map<string, string>;
}

let engine: Promise<ItemNames> | undefined;

async function packagedAsset(
  path: "pobr_wasm_bg.wasm" | "pobr-data.json.gz",
): Promise<Response> {
  const response = await fetch(browser.runtime.getURL(`/pobr/${path}`));
  if (!response.ok) throw new Error(`无法读取插件内置的 PoE2 数据（${path}）`);
  return response;
}

async function loadEngine(): Promise<ItemNames> {
  const [module, data] = await Promise.all([
    packagedAsset("pobr_wasm_bg.wasm").then((response) =>
      response.arrayBuffer(),
    ),
    packagedAsset("pobr-data.json.gz").then(
      async (
        response,
      ): Promise<{ version: string; files: Record<string, string> }> => {
        const stream = response.body?.pipeThrough(
          new DecompressionStream("gzip"),
        );
        return new Response(stream).json();
      },
    ),
  ]);
  initSync({ module });
  if (schemaVersion() !== 22 || data.version !== "0.5.5.8") {
    throw new Error("插件内置的 PoE2 引擎与数据版本不兼容");
  }
  for (const [path, content] of Object.entries(data.files))
    stageDataFile(path, content);
  initStagedData();

  const baseItems: { id: string; name: string }[] = JSON.parse(
    data.files["base/base_items.json"],
  );
  const localized: Record<string, string> = JSON.parse(
    data.files["i18n/zh-CN/base_items.json"],
  );
  const words: Record<string, string> = JSON.parse(
    data.files["i18n/zh-CN/words.json"],
  );
  return {
    bases: new Map(
      baseItems.flatMap(({ id, name }) =>
        localized[id] ? [[localized[id], name]] : [],
      ),
    ),
    words: new Map(
      Object.entries(words).map(([english, chinese]) => [chinese, english]),
    ),
  };
}

function getEngine(): Promise<ItemNames> {
  if (!engine) {
    engine = loadEngine().catch((error) => {
      engine = undefined;
      throw error;
    });
  }
  return engine;
}

const itemLabels: Record<string, string> = {
  物品类别: "Item Class",
  物品分類: "Item Class",
  稀有度: "Rarity",
  品质: "Quality",
  品質: "Quality",
  物品等级: "Item Level",
  物品等級: "Item Level",
  需求: "Requirements",
  等级: "Level",
  等級: "Level",
  力量: "Str",
  敏捷: "Dex",
  智慧: "Int",
  插槽: "Sockets",
  护甲: "Armour",
  護甲: "Armour",
  闪避值: "Evasion Rating",
  閃避值: "Evasion Rating",
  能量护盾: "Energy Shield",
  能量護盾: "Energy Shield",
  格挡几率: "Chance to Block",
  物理伤害: "Physical Damage",
  元素伤害: "Elemental Damage",
  暴击几率: "Critical Hit Chance",
  每秒攻击次数: "Attacks per Second",
};
const rarities: Record<string, string> = {
  普通: "NORMAL",
  魔法: "MAGIC",
  稀有: "RARE",
  传奇: "UNIQUE",
  傳奇: "UNIQUE",
  独特: "UNIQUE",
  獨特: "UNIQUE",
};

function cleanMarkup(line: string): string {
  return line.replace(/\[[^\[\]\r\n|]+\|([^\[\]\r\n]+)\]/g, "$1");
}

function translateItemText(item: string, names: ItemNames): string {
  const lines = item.replace(/\r\n?/g, "\n").split("\n").map(cleanMarkup);
  const rarityLine = lines.findIndex((line) =>
    /^(?:Rarity|稀\s*有\s*度)\s*[:：]/i.test(line),
  );
  const divider = lines.findIndex(
    (line, index) => index > rarityLine && /^-{3,}$/.test(line.trim()),
  );
  const baseLine = divider < 0 ? lines.length - 1 : divider - 1;
  const translated = lines.map((line, index) => {
    if (index === rarityLine) {
      const rarity = line.split(/[:：]/, 2)[1].trim();
      return `Rarity: ${rarities[rarity] ?? rarity}`;
    }
    if (rarityLine >= 0 && index > rarityLine && index <= baseLine) {
      const text = line.trim();
      return (
        (index === baseLine ? names.bases.get(text) : undefined) ??
        names.words.get(text) ??
        line
      );
    }
    if (/^(?:已腐化(?:的)?|已汙染|已污染)$/.test(line.trim()))
      return "Corrupted";
    if (/^未鉴定$/.test(line.trim())) return "Unidentified";
    return line.replace(/^([^:：]+)[:：]\s*/, (label, key: string) => {
      const english = itemLabels[key.replace(/\s/g, "")];
      return english ? `${english}: ` : label;
    });
  });
  return (
    JSON.parse(
      parseLocalizedLines("zh-CN", JSON.stringify(translated)),
    ) as string[]
  ).join("\n");
}

function translateItemJSON(
  item: Record<string, unknown>,
  names: ItemNames,
): string {
  const base = item.baseType ?? item.typeLine;
  if (typeof base !== "string" || !base)
    throw new Error("物品 JSON 缺少底材名称");
  const localized = { ...item, baseType: names.bases.get(base) ?? base };
  const [result] = JSON.parse(
    importTradeItemsJson(JSON.stringify([localized])),
  ) as { text?: string; error?: string }[];
  if (!result?.text) throw new Error(result?.error ?? "无法转换该 PoE2 物品");
  return result.text;
}

export async function translatePOE2Item(item: string): Promise<string> {
  const names = await getEngine();
  if (item.trimStart().startsWith("{"))
    return translateItemJSON(JSON.parse(item), names);
  return translateItemText(item, names);
}

// Preserve the custom-item editor's order: 1–12 o’clock, Phylactery, Zarokh, then Sinister sockets.
// Node IDs come from the packaged 0.5.5.8 passive jewel slots and tree coordinates.
const customSocketNodes = [
  21984, 61834, 32763, 60735, 46882, 54127, 2491, 26725, 55190, 26196, 7960,
  61419, 17788, 11184, 62152, 26178, 23960, 39087, 3367,
];

function applyCustomJewels(
  build: BuildJson,
  custom: transformTypes.CustomData,
  names: ItemNames,
) {
  const jewels = new Map(
    build.items.socket_jewels.map(({ socket_node, text }) => [
      socket_node,
      text,
    ]),
  );
  for (const [slot, index] of Object.entries(custom.jewels)) {
    const node = customSocketNodes[Number(slot)];
    const item = custom.items[index];
    if (node === undefined || !item)
      throw new Error("自定义珠宝的插槽或物品无效");
    const text =
      item.isJSON && item.json
        ? translateItemJSON(item.json, names)
        : item.text && translateItemText(item.text, names);
    if (!text) throw new Error("自定义珠宝缺少物品内容");
    jewels.set(node, text);
  }
  return Array.from(jewels, ([socket_node, text]) => ({ socket_node, text }));
}

export async function createPOE2Build(data: POE2BuildData): Promise<string> {
  const names = await getEngine();
  const { customItems, ...profile } = data;
  const build = JSON.parse(
    decodeBuildFileJson(
      JSON.stringify({ ...profile, format: "wegame", version: 1 }),
    ),
  ) as BuildJson;
  const request: CalculateBuildRequest & { notes: string } = {
    character: build.character,
    tree_version: build.tree.tree_version,
    allocated_nodes: build.tree.allocated_nodes,
    attribute_choices: build.tree.attribute_choices,
    items: build.items.equipped,
    flasks: build.items.flasks,
    limbs: build.items.limbs,
    jewels: customItems
      ? applyCustomJewels(build, customItems, names)
      : build.items.socket_jewels,
    equipment_jewels: build.items.equipment_jewels,
    socket_groups: build.socket_groups.map((group) => ({
      slot: group.slot,
      enabled: group.enabled,
      source: group.source,
      gems: group.gems,
      include_in_full_dps: group.include_in_full_dps,
      group_count: group.group_count,
      weapon_set: group.weapon_set,
      main_active_skill: group.main_active_skill,
    })),
    main_socket_group: build.main_socket_group ?? undefined,
    weapon_swap: build.weapon_swap,
    config_inputs: build.config_inputs,
    notes: build.notes ?? "",
  };
  return encodeBuildJson(JSON.stringify(request));
}
