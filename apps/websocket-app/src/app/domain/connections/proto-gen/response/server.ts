/* eslint-disable */

export const protobufPackage = "server.response.types";

export interface createServer {
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

export interface getManyServers {
  servers: createServer[];
}

export interface getServer {
  server: createServer | undefined;
}
