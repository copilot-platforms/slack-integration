-- CreateTable
CREATE TABLE "SyncedChannels" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "copilotChannelId" VARCHAR(32) NOT NULL,
    "slackChannelId" VARCHAR(9) NOT NULL,
    "slackChannelName" VARCHAR(255) NOT NULL,
    "syncedById" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SyncedChannels_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "IX_SyncedChannels_slackChannelId" ON "SyncedChannels"("slackChannelId");

-- CreateIndex
CREATE INDEX "IX_SyncedChannels_copilotChannelId" ON "SyncedChannels"("copilotChannelId");

-- CreateIndex
CREATE UNIQUE INDEX "SyncedChannels_slackChannelId_key" ON "SyncedChannels"("slackChannelId");

-- CreateIndex
CREATE UNIQUE INDEX "SyncedChannels_slackChannelName_key" ON "SyncedChannels"("slackChannelName");

-- CreateIndex
CREATE UNIQUE INDEX "SyncedChannels_copilotChannelId_key" ON "SyncedChannels"("copilotChannelId");
