-- CreateEnum
CREATE TYPE "WAPA" AS ENUM ('WAKKER', 'AANSPREEKBAAR', 'PIJNGEVOELIG', 'AREACTIEF');

-- CreateTable
CREATE TABLE "ParameterSet" (
    "id" SERIAL NOT NULL,
    "WAPA" "WAPA",
    "heartRate" INTEGER,
    "saturation" INTEGER,
    "temperature" DOUBLE PRECISION,
    "respiratoryRate" INTEGER,
    "bloodPressureSystolic" INTEGER,
    "bloodPressureDiastolic" INTEGER,
    "patientEncounterId" INTEGER NOT NULL,

    CONSTRAINT "ParameterSet_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ParameterSet" ADD CONSTRAINT "ParameterSet_patientEncounterId_fkey" FOREIGN KEY ("patientEncounterId") REFERENCES "PatientEncounter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
