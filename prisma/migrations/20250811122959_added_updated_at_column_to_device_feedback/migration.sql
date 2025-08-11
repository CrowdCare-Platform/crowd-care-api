/*
  Warnings:

  - Added the required column `updatedAt` to the `DeviceFeedback` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DeviceFeedback" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "DeviceFeedback_user_idx" ON "DeviceFeedback"("user");
