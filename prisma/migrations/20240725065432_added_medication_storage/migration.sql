-- CreateTable
CREATE TABLE "MedicationStorage" (
    "id" SERIAL NOT NULL,
    "rfid" TEXT NOT NULL,
    "stickerCode" TEXT NOT NULL,
    "aidPostId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "attachment" TEXT NOT NULL,

    CONSTRAINT "MedicationStorage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MedicationStorage" ADD CONSTRAINT "MedicationStorage_aidPostId_fkey" FOREIGN KEY ("aidPostId") REFERENCES "AidPost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
