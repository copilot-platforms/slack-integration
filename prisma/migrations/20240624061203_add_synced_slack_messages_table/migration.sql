-- CreateTable
CREATE TABLE "SyncedSlackMessages" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "eventTime" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SyncedSlackMessages_pkey" PRIMARY KEY ("id")
);
