/* eslint-disable */
import type {
  changeCommandStatusInput,
  changeExpireDate,
  changeOrGetCommandInput,
  getPendingTransactionInput,
} from "./request/command";
import type { createPlan, getPlanUser, plansByUser, updatePlan } from "./request/plan";
import type { createServerInput, getServerByServer, getServerByUser, setUsersServer } from "./request/server";
import type {
  bigCommerceTransaction,
  createTransaction as createTransaction1,
  transactionResult,
} from "./request/transaction";
import type { createUserInput, getUserInputEmail, getUserInputId } from "./request/user";
import type { command, commandArray } from "./response/command";
import type { getPlans, planData } from "./response/plan";
import type { createServer, getManyServers, getServer } from "./response/server";
import type { createTransaction, createTransactionBigCommerce, resultTransaction } from "./response/transaction";
import type { getUserResponse, postgresUser } from "./response/user";
import { Observable } from "rxjs";

export const protobufPackage = "core";

export interface userController {
  createUser(request: createUserInput): Observable<Promise<postgresUser>>;
  getUserInformationById(request: getUserInputId): Observable<Promise<getUserResponse>>;
  getUserInformationByEmail(request: getUserInputEmail): Observable<Promise<getUserResponse>>;
}

export interface serverController {
  createServer(request: createServerInput): Observable<Promise<createServer>>;
  getServersByUser(request: getServerByUser): Observable<Promise<getManyServers>>;
  getServer(request: getServerByServer): Observable<Promise<getServer>>;
  setUsersServer(request: setUsersServer): Observable<Promise<getServer>>;
}

export interface planController {
  getUsersPlans(request: getPlanUser): Observable<Promise<getPlans>>;
  getPlanById(request: plansByUser): Observable<Promise<planData>>;
  createPlan(request: createPlan): Observable<Promise<planData>>;
  updateUsersPlanById(request: updatePlan): Observable<Promise<planData>>;
  deleteUsersPlanById(request: plansByUser): Observable<Promise<planData>>;
}

export interface transactionController {
  initTransaction(request: createTransaction1): Observable<Promise<createTransaction>>;
  getTransactionResult(request: transactionResult): Observable<Promise<resultTransaction>>;
  bigCommerceTransaction(request: bigCommerceTransaction): Observable<Promise<createTransactionBigCommerce>>;
}

export interface CommandController {
  getPendingToSendTransaction(request: getPendingTransactionInput): Observable<Promise<commandArray>>;
  getExpiredToSendTransaction(request: getPendingTransactionInput): Observable<Promise<commandArray>>;
  changeCommandToSend(request: changeOrGetCommandInput): Observable<Promise<command>>;
  changeCommandToSendExpired(request: changeOrGetCommandInput): Observable<Promise<command>>;
  getCommandById(request: changeOrGetCommandInput): Observable<Promise<command>>;
  changeCommandStatus(request: changeCommandStatusInput): Observable<Promise<command>>;
  changeExpireDate(request: changeExpireDate): Observable<Promise<command>>;
}
