/*
  Warnings:

  - You are about to drop the column `SleepCapacity` on the `AidPost` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AidPost" DROP COLUMN "SleepCapacity",
ADD COLUMN     "sleepCapacity" INTEGER NOT NULL DEFAULT 0;
