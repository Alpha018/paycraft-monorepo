-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN', 'OWNER');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('TRANSBANK');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('STARTED', 'ERROR', 'PAID');

-- CreateEnum
CREATE TYPE "TimeUnit" AS ENUM ('MINUTE', 'HOUR', 'DAY', 'MONTH', 'YEAR');

-- CreateEnum
CREATE TYPE "CommandStatus" AS ENUM ('STARTED', 'SEND', 'DONE', 'SEND_EXPIRED', 'EXPIRED');

-- CreateTable
CREATE TABLE "Command" (
    "id" SERIAL NOT NULL,
    "status" "CommandStatus" NOT NULL,
    "transactionId" INTEGER NOT NULL,
    "planId" INTEGER NOT NULL,
    "userName" TEXT NOT NULL,
    "expireDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Command_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "status" "TransactionStatus" NOT NULL,
    "serverId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "userName" TEXT NOT NULL,
    "payMethod" "PaymentMethod" NOT NULL,
    "rawData" JSONB,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plan" (
    "id" SERIAL NOT NULL,
    "amount" INTEGER NOT NULL,
    "expireTime" INTEGER NOT NULL,
    "expireUnit" "TimeUnit" NOT NULL,
    "contentfulId" TEXT,
    "contentfulData" JSONB,
    "serverId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Server" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "serverToken" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL,
    "pageUrl" TEXT NOT NULL,
    "successPaymentUrl" TEXT NOT NULL,
    "failPaymentUrl" TEXT NOT NULL,
    "adminId" INTEGER NOT NULL,
    "maxPlans" INTEGER DEFAULT 3,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Server_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserServer" (
    "id" SERIAL NOT NULL,
    "displayName" TEXT NOT NULL,
    "uniqueId" TEXT NOT NULL,
    "serverId" INTEGER NOT NULL,

    CONSTRAINT "UserServer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "firebaseUid" TEXT NOT NULL,
    "roles" "UserRole"[],
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommandTemplate" (
    "id" SERIAL NOT NULL,
    "command" TEXT NOT NULL,
    "requiredOnline" BOOLEAN NOT NULL,
    "commandExecuteId" INTEGER NOT NULL,
    "commandExpiredId" INTEGER NOT NULL,

    CONSTRAINT "CommandTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommandLine" (
    "id" SERIAL NOT NULL,
    "command" TEXT NOT NULL,
    "requiredOnline" BOOLEAN NOT NULL,
    "commandExecuteId" INTEGER NOT NULL,
    "commandExpiredId" INTEGER NOT NULL,

    CONSTRAINT "CommandLine_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Server_serverToken_key" ON "Server"("serverToken");

-- CreateIndex
CREATE INDEX "Server_serverToken_ip_idx" ON "Server"("serverToken", "ip");

-- CreateIndex
CREATE INDEX "UserServer_displayName_uniqueId_idx" ON "UserServer"("displayName", "uniqueId");

-- CreateIndex
CREATE UNIQUE INDEX "User_firebaseUid_key" ON "User"("firebaseUid");

-- CreateIndex
CREATE INDEX "User_firebaseUid_idx" ON "User"("firebaseUid");

-- AddForeignKey
ALTER TABLE "Command" ADD CONSTRAINT "Command_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Command" ADD CONSTRAINT "Command_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Server" ADD CONSTRAINT "Server_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserServer" ADD CONSTRAINT "UserServer_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommandTemplate" ADD CONSTRAINT "CommandTemplate_commandExecuteId_fkey" FOREIGN KEY ("commandExecuteId") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommandTemplate" ADD CONSTRAINT "CommandTemplate_commandExpiredId_fkey" FOREIGN KEY ("commandExpiredId") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommandLine" ADD CONSTRAINT "CommandLine_commandExecuteId_fkey" FOREIGN KEY ("commandExecuteId") REFERENCES "Command"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommandLine" ADD CONSTRAINT "CommandLine_commandExpiredId_fkey" FOREIGN KEY ("commandExpiredId") REFERENCES "Command"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
