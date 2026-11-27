/* tslint:disable */
/* eslint-disable */

/**
 * JS entry point: `attributionJson(requestJson) -> string` (source-contribution attribution).
 */
export function attributionJson(request_json: string): string;

/**
 * JS entry point: `availableLocales() -> string` (JSON `[{code, fallback, chain, templates}]`:
 * the locales the data pack declares, with their fallback chains).
 */
export function availableLocales(): string;

/**
 * JS entry point: `breakdownDescriptorsJson() -> string` (the detail kind of every
 * display stat; static, callable before data is loaded).
 */
export function breakdownDescriptorsJson(): string;

/**
 * JS entry point: `calculateBuildJson(requestJson) -> string` (the full display_catalog plus breakdown).
 */
export function calculateBuildJson(request_json: string): string;

/**
 * JS entry point: `calculateJson(inputJson) -> string` (minimal scalar input plus modifier text).
 */
export function calculateJson(input_json: string): string;

/**
 * JS entry point: `classifyItemLinesJson(text) -> string` (item text -> per-line categories, for Items panel coloring).
 */
export function classifyItemLinesJson(text: string): string;

/**
 * JS entry point: `dataInfo() -> string` (loaded data, tree label and locales).
 */
export function dataInfo(): string;

/**
 * JS entry point: `decodeBuildFileJson(content) -> string` (a game planner or legacy `.build` file -> a structured build).
 */
export function decodeBuildFileJson(content: string): string;

/**
 * JS entry point: `decodeBuildJson(pobCode) -> string` (structured build JSON).
 */
export function decodeBuildJson(code: string): string;

/**
 * JS entry point: `decodeBuildLoadoutJson(requestJson) -> string` —
 * switches to a specified loadout and re-decodes (`{code, tree, item, skill}`,
 * with indices taken from the response's `loadouts[]`).
 */
export function decodeBuildLoadoutJson(request_json: string): string;

/**
 * JS entry point: `displayCatalogJson() -> string` (static display metadata).
 */
export function displayCatalogJson(): string;

export function encodeBuildFileJson(request: string): string;

/**
 * JS entry point: `encodeBuildJson(requestJson) -> string` (edit state -> a PoB2 share code).
 */
export function encodeBuildJson(request_json: string): string;

/**
 * JS entry point: `gameName(lang, kind, id) -> string | undefined` (a name from the
 * locale's `kind` table, following its declared fallbacks; undefined when none names it).
 */
export function gameName(lang: string, kind: string, id: string): string | undefined;

/**
 * JS entry point: `gemCatalogJson() -> string` (the gem picker's catalog).
 */
export function gemCatalogJson(): string;

export function importPartyMemberJson(code: string): string;

export function importTradeItemsJson(input: string): string;

/**
 * JS entry point: `initStagedData()` — builds game data from the
 * injected files (a one-time step, zero I/O afterward).
 */
export function initStagedData(): void;

/**
 * JS entry point: `initStagedDataVerified()` — `initStagedData` for a caller that
 * has already compared every file the manifest lists with its SHA-256 digest.
 */
export function initStagedDataVerified(): void;

/**
 * JS entry point: `isDataReady() -> bool`.
 */
export function isDataReady(): boolean;

/**
 * Inspect applicable augments and safe socket capacity for one item.
 */
export function itemAugmentInfoJson(item_text: string): string;

export function itemCraftingCatalogJson(): string;

/**
 * JS entry point: `lineUsageJson(requestJson) -> string` (what the
 * calculation does with each line of the build; costs more than a calculation).
 */
export function lineUsageJson(request_json: string): string;

/**
 * JS entry point: `manageLoadoutJson(requestJson) -> string` — copies,
 * renames, or deletes a loadout, returning the new build code
 * (`{code, op, name?, tree?, item?, skill?}`).
 */
export function manageLoadoutJson(request_json: string): string;

export function minionCatalogJson(): string;

/**
 * JS entry point: `nodePowerJson(requestJson) -> string` (the tree node power heatmap).
 */
export function nodePowerJson(request_json: string): string;

export function normalizeItemDraftJson(text: string): string;

/**
 * JS entry point: `optimizeVariantsJson(requestJson) -> string`
 * (generic variant evaluation: the compute side of the optimization framework).
 */
export function optimizeVariantsJson(request_json: string): string;

/**
 * JS entry point: `parseLocalizedLines(lang, linesJson) -> string` (`lang` mod lines -> English canonical lines).
 */
export function parseLocalizedLines(lang: string, lines_json: string): string;

/**
 * Preview conversion of the active passive spec or every spec to current data.
 */
export function previewTreeConversionJson(request_json: string): string;

/**
 * Preview and validate one connected shared/weapon-set passive edit.
 */
export function previewTreeEditJson(request_json: string): string;

/**
 * JS entry point: `reforgeRunesJson(requestJson) -> string` (re-socket runes -> rewritten item text).
 */
export function reforgeRunesJson(request_json: string): string;

/**
 * JS entry point: `runeCatalogJson(itemText) -> string` (the rune/soul
 * core picker's catalog; when itemText is non-empty, each rune gets its
 * applicable effect lines for that item attached).
 */
export function runeCatalogJson(item_text: string): string;

/**
 * JS entry point: `schemaVersion() -> number` (the JSON contract version, for the boot handshake).
 */
export function schemaVersion(): number;

/**
 * JS entry point: `skillMetricsJson(requestJson) -> string` (independent active-effect metrics).
 */
export function skillMetricsJson(request_json: string): string;

/**
 * JS entry point: `stageDataBytes(path, bytes)` — like `stageDataFile`, from a
 * `Uint8Array` (no string decoding on the way in).
 */
export function stageDataBytes(path: string, bytes: Uint8Array): void;

/**
 * JS entry point: `stageDataFile(path, content)` — injects data files one at a time (from JS fetch results).
 */
export function stageDataFile(path: string, content: string): void;

/**
 * JS entry point: batch group compatibility for the editor and support planner.
 */
export function supportGroupsCompatibleJson(input: string): string;

/**
 * JS entry point: `translateLines(lang, linesJson) -> string` (English mod lines -> `lang` display).
 */
export function translateLines(lang: string, lines_json: string): string;

/**
 * JS entry point: `translateLinesDetailed(lang, linesJson) -> string`: `translateLines`'
 * texts as `[{text, origin}]`, `origin` `"agent"` / `"human"` for the translation
 * repository's own supplement text and `null` for official text or a line kept in English.
 */
export function translateLinesDetailed(lang: string, lines_json: string): string;

export function uniqueCatalogJson(): string;

export function uniqueItemDraftJson(request: string): string;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly attributionJson: (a: number, b: number) => [number, number, number, number];
    readonly availableLocales: () => [number, number, number, number];
    readonly breakdownDescriptorsJson: () => [number, number, number, number];
    readonly calculateBuildJson: (a: number, b: number) => [number, number, number, number];
    readonly calculateJson: (a: number, b: number) => [number, number, number, number];
    readonly classifyItemLinesJson: (a: number, b: number) => [number, number, number, number];
    readonly dataInfo: () => [number, number, number, number];
    readonly decodeBuildFileJson: (a: number, b: number) => [number, number, number, number];
    readonly decodeBuildJson: (a: number, b: number) => [number, number, number, number];
    readonly decodeBuildLoadoutJson: (a: number, b: number) => [number, number, number, number];
    readonly displayCatalogJson: () => [number, number, number, number];
    readonly encodeBuildFileJson: (a: number, b: number) => [number, number, number, number];
    readonly encodeBuildJson: (a: number, b: number) => [number, number, number, number];
    readonly gameName: (a: number, b: number, c: number, d: number, e: number, f: number) => [number, number, number, number];
    readonly gemCatalogJson: () => [number, number, number, number];
    readonly importPartyMemberJson: (a: number, b: number) => [number, number, number, number];
    readonly importTradeItemsJson: (a: number, b: number) => [number, number, number, number];
    readonly initStagedData: () => [number, number];
    readonly initStagedDataVerified: () => [number, number];
    readonly isDataReady: () => number;
    readonly itemAugmentInfoJson: (a: number, b: number) => [number, number, number, number];
    readonly itemCraftingCatalogJson: () => [number, number, number, number];
    readonly lineUsageJson: (a: number, b: number) => [number, number, number, number];
    readonly manageLoadoutJson: (a: number, b: number) => [number, number, number, number];
    readonly minionCatalogJson: () => [number, number, number, number];
    readonly nodePowerJson: (a: number, b: number) => [number, number, number, number];
    readonly normalizeItemDraftJson: (a: number, b: number) => [number, number, number, number];
    readonly optimizeVariantsJson: (a: number, b: number) => [number, number, number, number];
    readonly parseLocalizedLines: (a: number, b: number, c: number, d: number) => [number, number, number, number];
    readonly previewTreeConversionJson: (a: number, b: number) => [number, number, number, number];
    readonly previewTreeEditJson: (a: number, b: number) => [number, number, number, number];
    readonly reforgeRunesJson: (a: number, b: number) => [number, number, number, number];
    readonly runeCatalogJson: (a: number, b: number) => [number, number, number, number];
    readonly schemaVersion: () => number;
    readonly skillMetricsJson: (a: number, b: number) => [number, number, number, number];
    readonly stageDataBytes: (a: number, b: number, c: number, d: number) => void;
    readonly stageDataFile: (a: number, b: number, c: number, d: number) => void;
    readonly supportGroupsCompatibleJson: (a: number, b: number) => [number, number, number, number];
    readonly translateLines: (a: number, b: number, c: number, d: number) => [number, number, number, number];
    readonly translateLinesDetailed: (a: number, b: number, c: number, d: number) => [number, number, number, number];
    readonly uniqueCatalogJson: () => [number, number, number, number];
    readonly uniqueItemDraftJson: (a: number, b: number) => [number, number, number, number];
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
    readonly __externref_table_dealloc: (a: number) => void;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
