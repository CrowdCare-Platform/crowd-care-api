/*
  Warnings:

  - You are about to drop the column `timeSinceLastLocationChange` on the `PatientEncounter` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PatientEncounter" DROP COLUMN "timeSinceLastLocationChange",
ADD COLUMN     "timeLastLocationChange" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
