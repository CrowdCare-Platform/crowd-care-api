/*
  Warnings:

  - Added the required column `eventId` to the `AidPost` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AidPost" ADD COLUMN     "eventId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "AidPost" ADD CONSTRAINT "AidPost_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
