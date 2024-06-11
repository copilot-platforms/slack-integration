-- AlterTable
ALTER TABLE "SyncedChannels" ALTER COLUMN "slackChannelId" SET DATA TYPE VARCHAR(32);

-- AlterTable
ALTER TABLE "SyncedMessages" ALTER COLUMN "slackChannelId" SET DATA TYPE VARCHAR(32);
