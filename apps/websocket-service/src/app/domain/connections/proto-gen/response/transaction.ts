/* eslint-disable */

export const protobufPackage = "transaction.response.types";

export interface createTransaction {
  url: string;
  token: string;
  transactionId: number;
  redirect: string;
}

export interface resultTransaction {
  redirectUrl: string;
}

export interface createTransactionBigCommerce {
  transactionId: number;
}
