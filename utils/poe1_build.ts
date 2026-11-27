import type { GetItemsResult, GetPassiveSkillsResult } from "cn-poe-utils/api";
import { transform } from "cn-poe-utils/building";
import { DATA } from "cn-poe-utils/data/pob";
import { TranslatorFactory } from "cn-poe-utils/translator/zh2en";

import { encodeBuildCode } from "./compress";
import treeData from "./poe1_tree_3_30.json";

// 3.30 cluster jewel socket and orbit data from PoB Community 2.69.0.
// https://github.com/PathOfBuildingCommunity/PathOfBuilding/blob/v2.69.0/src/TreeData/3_30/tree.lua
const { skillsPerOrbit, ...tree } = treeData;
const currentTree = {
  ...tree,
  constants: { ...DATA.tree.constants, skillsPerOrbit },
};
const phreciaClasses = new Set(Object.values(DATA.phreciaAscendancyMap));
let translatorFactory: TranslatorFactory | undefined;

function getTranslatorFactory(): TranslatorFactory {
  return (translatorFactory ??= new TranslatorFactory());
}

export function translatePOE1Item(item: string): string {
  return getTranslatorFactory().getTextTranslator().trans(item);
}

const gemLink =
  /\[Metadata\/Items\/Gems\/[^<>|\[\]\r\n]+?(?:<|&lt;)gemlevel=\d+(?:>|&gt;)\|([^\[\]|\r\n]+)\]/g;

function escapeXmlText(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeXmlAttribute(text: string): string {
  return escapeXmlText(text).replaceAll('"', "&quot;");
}

export async function createPOE1Build(data: {
  items: GetItemsResult;
  passiveSkills: GetPassiveSkillsResult;
}): Promise<string> {
  const { items, passiveSkills } = structuredClone(data);
  if (!items.character || !Array.isArray(items.items)) {
    throw new Error("无法导出 PoE1：缺少角色或装备数据。");
  }
  if (
    !Array.isArray(passiveSkills.items) ||
    !Array.isArray(passiveSkills.hashes)
  ) {
    throw new Error("无法导出 PoE1：缺少天赋数据。");
  }

  const factory = getTranslatorFactory();
  // The stat translator needs the displayed gem name to look up the modifier.
  for (const item of [...items.items, ...passiveSkills.items]) {
    if (item.explicitMods) {
      item.explicitMods = item.explicitMods.map((line) =>
        line.replace(gemLink, (_, name: string) => name),
      );
    }
  }
  const translator = factory.getJsonTranslator();
  translator.transItems(items);
  translator.transPassiveSkills(passiveSkills);

  const isPhrecia = phreciaClasses.has(items.character.class);
  const defaultTree = DATA.tree;
  let building: ReturnType<typeof transform>;
  try {
    // The library reads the shared tree synchronously while resolving jewel slots.
    if (!isPhrecia) DATA.tree = currentTree;
    building = transform(items, passiveSkills);
  } finally {
    DATA.tree = defaultTree;
  }

  if (!isPhrecia) building.tree.spec.treeVersion = "3_30";
  for (const skill of building.skills.skillSet.skills) {
    skill.imbuedSupport = escapeXmlAttribute(skill.imbuedSupport);
    for (const gem of skill.gems)
      gem.nameSpec = escapeXmlAttribute(gem.nameSpec);
  }
  for (const override of building.tree.spec.overrides.members) {
    override.dn = escapeXmlAttribute(override.dn ?? "");
  }

  const basic = factory.getBasicTranslator();
  const xml = building
    .toString()
    .replace(
      /(^<Item\b[^>]*>\n)([\s\S]*?)(^<\/Item>)/gm,
      (_, open: string, body: string, close: string) => {
        const text = body.replace(
          gemLink,
          (_, name: string) => basic.transSkill(name) ?? name,
        );
        return open + escapeXmlText(text) + close;
      },
    );
  return encodeBuildCode(xml);
}
