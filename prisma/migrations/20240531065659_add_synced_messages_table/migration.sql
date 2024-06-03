-- CreateTable
CREATE TABLE "SyncedMessages" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "copilotChannelId" VARCHAR(32),
    "slackChannelId" VARCHAR(9),
    "messageId" VARCHAR(255) NOT NULL,
    "senderId" UUID NOT NULL,
    "status" "SyncStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SyncedMessages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "IX_SyncedMessages_messageId" ON "SyncedMessages"("messageId");

-- CreateIndex
CREATE UNIQUE INDEX "SyncedMessages_messageId_key" ON "SyncedMessages"("messageId");
