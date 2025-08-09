-- DropIndex
DROP INDEX "PatientEncounter_rfid_qrCode_idx";

-- AlterTable
ALTER TABLE "PatientEncounter" ADD COLUMN     "eventId" INTEGER NOT NULL DEFAULT 1;

-- CreateIndex
CREATE INDEX "PatientEncounter_rfid_qrCode_eventId_idx" ON "PatientEncounter"("rfid", "qrCode", "eventId");

-- AddForeignKey
ALTER TABLE "PatientEncounter" ADD CONSTRAINT "PatientEncounter_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
