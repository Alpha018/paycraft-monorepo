/* eslint-disable */

export const protobufPackage = "server.request.types";

export interface createServerInput {
  name: string;
  ip: string;
  logoUrl: string;
  pageUrl: string;
  successPaymentUrl: string;
  failPaymentUrl: string;
  adminId: number;
}

export interface getServerByUser {
  id?: number | undefined;
  firebaseUid?: string | undefined;
}

export interface getServerByServer {
  id?: number | undefined;
  serverToken?: string | undefined;
}

export interface setUsersServer {
  serverId: number;
  onlineUsers: setUsersServer_userServer[];
}

export interface setUsersServer_userServer {
  displayName: string;
  uniqueId: string;
}
