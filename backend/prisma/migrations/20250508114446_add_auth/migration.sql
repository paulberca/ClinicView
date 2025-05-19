/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `FamilyDoctor` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'DOCTOR');

-- AlterTable
ALTER TABLE "FamilyDoctor" ADD COLUMN     "userId" INTEGER;

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "FamilyDoctor_userId_key" ON "FamilyDoctor"("userId");

-- CreateIndex
CREATE INDEX "Patient_name_idx" ON "Patient"("name");

-- CreateIndex
CREATE INDEX "Patient_familyDoctorId_idx" ON "Patient"("familyDoctorId");

-- CreateIndex
CREATE INDEX "Patient_admissionDate_idx" ON "Patient"("admissionDate");

-- AddForeignKey
ALTER TABLE "FamilyDoctor" ADD CONSTRAINT "FamilyDoctor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
