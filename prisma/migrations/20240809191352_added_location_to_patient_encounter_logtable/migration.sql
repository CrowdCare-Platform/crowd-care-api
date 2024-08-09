-- CreateEnum
CREATE TYPE "Location" AS ENUM ('WAITING_ROOM', 'T1', 'T2', 'T3', 'SLEEP');

-- AlterTable
ALTER TABLE "PatientEncounter" ADD COLUMN     "location" "Location" NOT NULL DEFAULT 'WAITING_ROOM';

-- CreateTable
CREATE TABLE "PatientEncounterLocationLog" (
    "id" SERIAL NOT NULL,
    "patientEncounterId" INTEGER NOT NULL,
    "toLocation" "Location" NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PatientEncounterLocationLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PatientEncounterLocationLog" ADD CONSTRAINT "PatientEncounterLocationLog_patientEncounterId_fkey" FOREIGN KEY ("patientEncounterId") REFERENCES "PatientEncounter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
