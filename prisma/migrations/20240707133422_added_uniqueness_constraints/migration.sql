/*
  Warnings:

  - A unique constraint covering the columns `[qrCode]` on the table `PatientEncounter` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[rfid]` on the table `PatientEncounter` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PatientEncounter_qrCode_key" ON "PatientEncounter"("qrCode");

-- CreateIndex
CREATE UNIQUE INDEX "PatientEncounter_rfid_key" ON "PatientEncounter"("rfid");
