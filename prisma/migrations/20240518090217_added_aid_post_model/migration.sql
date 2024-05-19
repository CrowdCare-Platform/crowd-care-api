/*
  Warnings:

  - You are about to drop the column `aidPost` on the `PatientEncounter` table. All the data in the column will be lost.
  - Added the required column `aidPostId` to the `PatientEncounter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PatientEncounter" DROP COLUMN "aidPost",
ADD COLUMN     "aidPostId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "AidPost" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "AidPost_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PatientEncounter" ADD CONSTRAINT "PatientEncounter_aidPostId_fkey" FOREIGN KEY ("aidPostId") REFERENCES "AidPost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
