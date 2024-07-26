/*
  Warnings:

  - A unique constraint covering the columns `[stickerCode]` on the table `MedicationStorage` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "MedicationStorage_stickerCode_key" ON "MedicationStorage"("stickerCode");

-- CreateIndex
CREATE INDEX "MedicationStorage_stickerCode_rfid_idx" ON "MedicationStorage"("stickerCode", "rfid");

-- CreateIndex
CREATE INDEX "PatientEncounter_rfid_qrCode_idx" ON "PatientEncounter"("rfid", "qrCode");
