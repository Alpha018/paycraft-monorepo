/* eslint-disable */
import type { userRole } from "../response/user";

export const protobufPackage = "user.request.types";

export interface createUserInput {
  displayName: string;
  email: string;
  role: userRole;
}

export interface getUserInputId {
  id?: number | undefined;
}

export interface getUserInputEmail {
  email?: string | undefined;
}
