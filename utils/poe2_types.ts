/** Minimal structural types used by the browser extension's PoE2 API calls. */

export namespace wgTypes {
  export interface GetRoleInfoResult {
    role: {
      role_id: string;
    };
    [key: string]: unknown;
  }
}

export namespace itemTypes {
  export interface Item {
    name: string;
    typeLine: string;
    [key: string]: unknown;
  }
}

export namespace transformTypes {
  export interface CustomItem {
    isText: boolean;
    isJSON: boolean;
    text?: string;
    json?: itemTypes.Item;
  }

  export interface CustomData {
    items: CustomItem[];
    jewels: Record<number, number>;
  }
}
