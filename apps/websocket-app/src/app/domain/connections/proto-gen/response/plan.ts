/* eslint-disable */

export const protobufPackage = "plan.response.types";

export interface planData {
  id: number;
  amount: number;
  expireTime: number;
  expireUnit: string;
  contentfulId: string;
  serverId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface getPlans {
  data: planData[];
}
