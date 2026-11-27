import type { GetItemsResult, GetPassiveSkillsResult } from "cn-poe-utils/api";
import type { POE2BuildData } from "./poe2_build";

export type CharacterData =
  | {
      game: "poe1";
      data: { items: GetItemsResult; passiveSkills: GetPassiveSkillsResult };
    }
  | { game: "poe2"; data: POE2BuildData };

export function saveCharacterData(character: CharacterData): void {
  const contents = JSON.stringify(
    { format: "poexport-character", version: 1, ...character },
    null,
    2,
  );
  const url = URL.createObjectURL(
    new Blob([contents], { type: "application/json" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = `poexport-${character.game}-character.json`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function readCharacterData(file: File): Promise<CharacterData> {
  const record = JSON.parse(await file.text());
  if (record?.format !== "poexport-character" || record.version !== 1) {
    throw new Error("请选择通过 PoExport 保存的角色 JSON 文件");
  }
  if (
    (record.game !== "poe1" && record.game !== "poe2") ||
    !record.data ||
    typeof record.data !== "object" ||
    Array.isArray(record.data)
  ) {
    throw new Error("角色数据格式无效");
  }
  return record;
}
