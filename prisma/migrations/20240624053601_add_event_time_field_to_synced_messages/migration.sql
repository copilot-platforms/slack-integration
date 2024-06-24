/*
  Warnings:

  - Added the required column `eventTime` to the `SyncedMessages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SyncedMessages" ADD COLUMN     "eventTime" TEXT NOT NULL;
