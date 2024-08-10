-- AlterTable
ALTER TABLE "PatientEncounter" ADD COLUMN     "timeSinceLastLocationChange" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
