-- CreateTable
CREATE TABLE "Patient" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "gender" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "homeAddress" TEXT NOT NULL,
    "allergies" TEXT[],
    "bloodType" TEXT NOT NULL,
    "chronicCondition" TEXT NOT NULL,
    "familyDoctor" TEXT NOT NULL,
    "insurance" TEXT NOT NULL,
    "admissionDate" TIMESTAMP(3) NOT NULL,
    "condition" TEXT NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);
