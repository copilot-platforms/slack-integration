/*
  Warnings:

  - A unique constraint covering the columns `[workspaceId]` on the table `SyncedWorkspaces` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "SyncedWorkspaces" ADD COLUMN     "slackAccessToken" VARCHAR(255);

-- CreateIndex
CREATE INDEX "IX_SyncedWorkspaces_workspaceId" ON "SyncedWorkspaces"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "SyncedWorkspaces_workspaceId_key" ON "SyncedWorkspaces"("workspaceId");
