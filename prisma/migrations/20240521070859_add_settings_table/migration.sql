-- CreateEnum
CREATE TYPE "ChannelSyncOptions" AS ENUM ('clientAndCompany');

-- CreateTable
CREATE TABLE "Settings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workspaceId" VARCHAR(32) NOT NULL,
    "bidirectionalSlackSync" BOOLEAN NOT NULL DEFAULT false,
    "channelsToSync" "ChannelSyncOptions" NOT NULL DEFAULT 'clientAndCompany',
    "fallbackMessageSenderId" UUID NOT NULL,
    "slackChannelPrefix" VARCHAR(255) NOT NULL,
    "isSyncRunning" BOOLEAN NOT NULL DEFAULT false,
    "lastSyncedById" UUID,
    "lastSyncedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "IX_Settings_workspaceId_deletedAt" ON "Settings"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "Settings_workspaceId_key" ON "Settings"("workspaceId");
