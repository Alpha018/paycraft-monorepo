/* eslint-disable */

export const protobufPackage = "user.response.types";

export enum userRole {
  USER = 0,
  ADMIN = 1,
  OWNER = 2,
  UNRECOGNIZED = -1,
}

export interface getUserResponse {
  database: postgresUser | undefined;
  firebase: firebaseUser | undefined;
}

export interface postgresUser {
  id: number;
  firebaseUid: string;
  roles: userRole[];
  password: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface firebaseUser {
  uid: string;
  email: string;
  emailVerified: boolean;
  displayName: string;
  disabled: boolean;
  tokensValidAfterTime: string;
  providerData: firebaseUser_ProviderData[];
}

export interface firebaseUser_ProviderData {
  uid: string;
  displayName: string;
  email: string;
  providerId: string;
}
