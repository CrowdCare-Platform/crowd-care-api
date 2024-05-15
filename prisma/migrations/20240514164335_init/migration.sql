-- CreateEnum
CREATE TYPE "MethodIn" AS ENUM ('SELF', 'WITH_SUPPORT', 'CREW_WALKING', 'STRETCHER', 'AMBULANCE', 'SECURITY_POLICE');

-- CreateEnum
CREATE TYPE "MethodOut" AS ENUM ('BACK_TO_FESTIVAL', 'OTHER_STATION', 'HOME', 'TO_HOSPITAL_SELF', 'TO_HOSPITAL_NDLZ', 'TO_HOSPITAL_DGH', 'LEFT_SELF', 'LEFT_FORGOT');

-- CreateEnum
CREATE TYPE "TriageCategory" AS ENUM ('RED', 'YELLOW', 'GREEN', 'WHITE');

-- CreateEnum
CREATE TYPE "ChiefComplaint" AS ENUM ('ADEMHALING', 'HYPERVENTILATIE', 'ALLERGIE', 'LOKALE_REACTIE', 'ANAFYLAXIE', 'BEWEGINGSSTELSEL', 'VERSTUIKING', 'RADIOGRAFIE', 'BRANDWONDE', 'BEWUSTZIJNSVERLIES', 'FLAUWTE_SYNCOPE', 'EPILEPSIE', 'EIGEN_MEDICATIE', 'HARTKLACHTEN', 'HOOFDPIJN', 'HUIDWONDE', 'HECHTING', 'INSECTENBEET', 'ONTSTEKING', 'INTOXICATIE', 'ALCOHOL', 'DRUGS', 'KEELPIJN', 'MAAG_DARM', 'OOGLETSEL', 'TANDPIJN', 'ANDERE', 'PLEISTER', 'MAANDVERBAND', 'ZONNECREME');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "PatientType" AS ENUM ('VISITOR', 'CREW', 'EXTERNAL');

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatientEncounter" (
    "id" SERIAL NOT NULL,
    "qrCode" TEXT,
    "rfid" TEXT NOT NULL,
    "timeIn" TIMESTAMP(3) NOT NULL,
    "methodIn" "MethodIn" NOT NULL,
    "ambulanceInId" INTEGER,
    "gender" "Gender",
    "age" INTEGER,
    "patientType" "PatientType",
    "triage" "TriageCategory",
    "chiefComplaint" "ChiefComplaint",
    "timeOut" TIMESTAMP(3),
    "methodOut" "MethodOut",
    "ambulanceOutId" INTEGER,
    "hospitalOutId" INTEGER,
    "eventId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "aidPost" TEXT NOT NULL,
    "comments" TEXT,
    "attachments" TEXT[],

    CONSTRAINT "PatientEncounter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hospital" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,

    CONSTRAINT "Hospital_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ambulance" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,

    CONSTRAINT "Ambulance_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PatientEncounter" ADD CONSTRAINT "PatientEncounter_ambulanceInId_fkey" FOREIGN KEY ("ambulanceInId") REFERENCES "Ambulance"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientEncounter" ADD CONSTRAINT "PatientEncounter_ambulanceOutId_fkey" FOREIGN KEY ("ambulanceOutId") REFERENCES "Ambulance"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientEncounter" ADD CONSTRAINT "PatientEncounter_hospitalOutId_fkey" FOREIGN KEY ("hospitalOutId") REFERENCES "Hospital"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientEncounter" ADD CONSTRAINT "PatientEncounter_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hospital" ADD CONSTRAINT "Hospital_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ambulance" ADD CONSTRAINT "Ambulance_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
