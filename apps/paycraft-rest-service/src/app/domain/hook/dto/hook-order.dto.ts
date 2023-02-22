export interface Data {
  type: string;
  id: number;
}

export interface HookOrder {
  producer: string;
  hash: string;
  created_at: number;
  store_id: string;
  scope: string;
  data: Data;
}
