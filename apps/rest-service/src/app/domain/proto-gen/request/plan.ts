/* eslint-disable */

export const protobufPackage = "plan.request.types";

export interface getPlanUser {
  serverReference: number;
  firebaseUid: string;
}

export interface plansByUser {
  id: number;
  firebaseUid: string;
}

export interface createPlan {
  serverReference: number;
  amount: number;
  title: string;
  description: string;
  expireTime: number;
  expireUnit: string;
  executeCommands: executeCommands[];
  expiredCommands: expiredCommands[];
  firebaseUid: string;
}

export interface updatePlan {
  id: number;
  firebaseUid: string;
  amount: number;
  title: string;
  description: string;
  expireTime: number;
  expireUnit: string;
  executeCommands: executeCommands[];
  expiredCommands: expiredCommands[];
}

export interface executeCommands {
  command: string;
  requiredOnline: boolean;
}

export interface expiredCommands {
  command: string;
  requiredOnline: boolean;
}
