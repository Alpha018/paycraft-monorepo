/* eslint-disable */

export const protobufPackage = "command.request.types";

export interface getPendingTransactionInput {
  serverToken: string;
}

export interface changeOrGetCommandInput {
  id: number;
  status?: string | undefined;
}

export interface changeCommandStatusInput {
  id: number;
  type: string;
}

export interface changeExpireDate {
  id: number;
  expireDate: string;
}
