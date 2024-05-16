/*
  Warnings:

  - The values [ZONNECREME] on the enum `ChiefComplaint` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ChiefComplaint_new" AS ENUM ('ADEMHALING', 'HYPERVENTILATIE', 'ALLERGIE', 'LOKALE_REACTIE', 'ANAFYLAXIE', 'BEWEGINGSSTELSEL', 'VERSTUIKING', 'RADIOGRAFIE', 'BRANDWONDE', 'BEWUSTZIJNSVERLIES', 'FLAUWTE_SYNCOPE', 'EPILEPSIE', 'EIGEN_MEDICATIE', 'HARTKLACHTEN', 'HOOFDPIJN', 'HUIDWONDE', 'HECHTING', 'INSECTENBEET', 'ONTSTEKING', 'INTOXICATIE', 'ALCOHOL', 'DRUGS', 'KEELPIJN', 'MAAG_DARM', 'OOGLETSEL', 'TANDPIJN', 'ANDERE', 'PLEISTER', 'MAANDVERBAND', 'ZONNECREME_AFTERSUN');
ALTER TABLE "PatientEncounter" ALTER COLUMN "chiefComplaint" TYPE "ChiefComplaint_new" USING ("chiefComplaint"::text::"ChiefComplaint_new");
ALTER TYPE "ChiefComplaint" RENAME TO "ChiefComplaint_old";
ALTER TYPE "ChiefComplaint_new" RENAME TO "ChiefComplaint";
DROP TYPE "ChiefComplaint_old";
COMMIT;
