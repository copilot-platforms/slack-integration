-- CreateEnum
CREATE TYPE "SyncStatus" AS ENUM ('pending', 'success', 'failed');

-- CreateTable
CREATE TABLE "SyncedChannels" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "copilotChannelId" VARCHAR(32),
    "slackChannelId" VARCHAR(9),
    "slackChannelName" VARCHAR(255),
    "status" "SyncStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "SyncedChannels_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "IX_SyncedChannels_slackChannelId" ON "SyncedChannels"("slackChannelId");

-- CreateIndex
CREATE INDEX "IX_SyncedChannels_copilotChannelId_status_deletedAt" ON "SyncedChannels"("copilotChannelId", "status", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "SyncedChannels_slackChannelId_key" ON "SyncedChannels"("slackChannelId");

-- CreateIndex
CREATE UNIQUE INDEX "SyncedChannels_slackChannelName_key" ON "SyncedChannels"("slackChannelName");

-- CreateIndex
CREATE UNIQUE INDEX "SyncedChannels_copilotChannelId_deletedAt_key" ON "SyncedChannels"("copilotChannelId", "deletedAt");
