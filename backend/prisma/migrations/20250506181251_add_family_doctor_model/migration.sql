/*
  Warnings:

  - You are about to drop the column `familyDoctor` on the `Patient` table. All the data in the column will be lost.
  - Added the required column `familyDoctorId` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "familyDoctor",
ADD COLUMN     "familyDoctorId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "FamilyDoctor" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "specialty" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,

    CONSTRAINT "FamilyDoctor_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_familyDoctorId_fkey" FOREIGN KEY ("familyDoctorId") REFERENCES "FamilyDoctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
