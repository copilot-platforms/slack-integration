/*
  Warnings:

  - Added the required column `workspaceId` to the `SyncedChannels` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workspaceId` to the `SyncedMessages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SyncedChannels" ADD COLUMN     "workspaceId" VARCHAR(32) NOT NULL;

-- AlterTable
ALTER TABLE "SyncedMessages" ADD COLUMN     "workspaceId" VARCHAR(32) NOT NULL;
