/* eslint-disable */
import type { Any } from "../google/protobuf/any";

export const protobufPackage = "transaction.request.types";

export interface createTransaction {
  planId: number;
  payMethod: string;
  userName: string;
  serverId: number;
}

export interface transactionResult {
  tokenWs: string;
  tbkToken: string;
}

export interface bigCommerceTransaction {
  rawData: Any | undefined;
  userName: string;
  planId: number;
  serverId: number;
}
