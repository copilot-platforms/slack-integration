-- CreateTable
CREATE TABLE "SyncedWorkspaces" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workspaceId" VARCHAR(32) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SyncedWorkspaces_pkey" PRIMARY KEY ("id")
);
