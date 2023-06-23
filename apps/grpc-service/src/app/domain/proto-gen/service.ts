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
  createUser(request: createUserInput): Observable<postgresUser>;
  getUserInformationById(request: getUserInputId): Observable<getUserResponse>;
  getUserInformationByEmail(request: getUserInputEmail): Observable<getUserResponse>;
}

export interface serverController {
  createServer(request: createServerInput): Observable<createServer>;
  getServersByUser(request: getServerByUser): Observable<getManyServers>;
  getServer(request: getServerByServer): Observable<getServer>;
  setUsersServer(request: setUsersServer): Observable<getServer>;
}

export interface planController {
  getUsersPlans(request: getPlanUser): Observable<getPlans>;
  getPlanById(request: plansByUser): Observable<planData>;
  createPlan(request: createPlan): Observable<planData>;
  updateUsersPlanById(request: updatePlan): Observable<planData>;
  deleteUsersPlanById(request: plansByUser): Observable<planData>;
}

export interface transactionController {
  initTransaction(request: createTransaction1): Observable<createTransaction>;
  getTransactionResult(request: transactionResult): Observable<resultTransaction>;
  bigCommerceTransaction(request: bigCommerceTransaction): Observable<createTransactionBigCommerce>;
}

export interface CommandController {
  getPendingToSendTransaction(request: getPendingTransactionInput): Observable<commandArray>;
  getExpiredToSendTransaction(request: getPendingTransactionInput): Observable<commandArray>;
  changeCommandToSend(request: changeOrGetCommandInput): Observable<command>;
  changeCommandToSendExpired(request: changeOrGetCommandInput): Observable<command>;
  getCommandById(request: changeOrGetCommandInput): Observable<command>;
  changeCommandStatus(request: changeCommandStatusInput): Observable<command>;
  changeExpireDate(request: changeExpireDate): Observable<command>;
}
