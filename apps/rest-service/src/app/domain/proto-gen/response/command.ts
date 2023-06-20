/* eslint-disable */
import type { Any } from "../google/protobuf/any";

export const protobufPackage = "command.response.types";

export interface executeCommands {
  id: number;
  command: string;
  requiredOnline: boolean;
  commandExecuteId: number;
  commandExpiredId?: number | undefined;
}

export interface expiredCommands {
  id: number;
  command: string;
  requiredOnline: boolean;
  commandExecuteId?: number | undefined;
  commandExpiredId: number;
}

export interface command {
  id: number;
  status: string;
  transactionId: number;
  userName: string;
  expireDate: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  executeCommands: executeCommands[];
  expiredCommands: expiredCommands[];
  transaction: Transaction | undefined;
}

export interface Server {
  id: number;
  name: string;
  serverToken: string;
  ip: string;
  logoUrl: string;
  pageUrl: string;
  successPaymentUrl: string;
  failPaymentUrl: string;
  adminId: number;
  maxPlans: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface Transaction {
  id: number;
  status: string;
  serverId: number;
  planId: number;
  token: string;
  amount: number;
  userName: string;
  payMethod: string;
  rawData: Any | undefined;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  server: Server | undefined;
}

export interface commandArray {
  items: command[];
}
