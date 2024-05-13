-- CreateEnum
CREATE TYPE "ChannelSyncOptions" AS ENUM ('clientAndCompany');

-- CreateTable
CREATE TABLE "Settings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workspaceId" VARCHAR(32) NOT NULL,
    "internalUserId" UUID NOT NULL,
    "bidirectionalSlackSync" BOOLEAN NOT NULL DEFAULT false,
    "channelsToSync" "ChannelSyncOptions" NOT NULL DEFAULT 'clientAndCompany',
    "fallbackMessageSenderId" UUID NOT NULL,
    "slackChannelPrefix" VARCHAR(255) NOT NULL,
    "isSyncing" BOOLEAN NOT NULL DEFAULT false,
    "lastSyncedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "IX_Settings_workspaceId_deletedAt" ON "Settings"("workspaceId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Settings_workspaceId_deletedAt_key" ON "Settings"("workspaceId", "deletedAt");
