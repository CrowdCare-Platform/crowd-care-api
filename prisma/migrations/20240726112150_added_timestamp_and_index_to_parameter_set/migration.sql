-- AlterTable
ALTER TABLE "ParameterSet" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "ParameterSet_patientEncounterId_idx" ON "ParameterSet"("patientEncounterId");
