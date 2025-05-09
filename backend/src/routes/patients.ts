import express from "express";
import { prisma } from "../prisma";
import { Prisma } from "@prisma/client";

const router = express.Router();

router.get("/", async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 1000;
  const search = req.query.search as string;
  const sortBy = req.query.sortBy as string; // e.g., "condition" or "admissionDate"
  const sortOrder = (req.query.sortOrder as string) === "desc" ? "desc" : "asc"; // default to "asc"
  const skip = (page - 1) * limit;

  const where: Prisma.PatientWhereInput = search
    ? {
        name: {
          contains: search,
          mode: Prisma.QueryMode.insensitive,
        },
      }
    : {};

  // Default sort is by ID if no valid sortBy is given
  const validSortFields = ["condition", "admissionDate"];
  const orderBy: Prisma.PatientOrderByWithRelationInput =
    validSortFields.includes(sortBy) ? { [sortBy]: sortOrder } : { id: "asc" };

  const patients = await prisma.patient.findMany({
    where,
    skip,
    take: limit,
    orderBy,
    include: {
      familyDoctor: {
        select: { id: true, name: true }, // Include doctor ID and name
      },
    },
  });

  res.json(patients);
});

router.get("/:id", async (req, res) => {
  const patient = await prisma.patient.findUnique({
    where: { id: Number(req.params.id) },
    include: {
      familyDoctor: {
        select: { id: true, name: true }, // Include doctor ID and name
      },
    },
  });
  res.json(patient);
});

router.post("/", async (req, res) => {
  try {
    const data = req.body;

    const patient = await prisma.patient.create({
      data: {
        ...data,
        dateOfBirth: new Date(data.dateOfBirth),
        admissionDate: new Date(data.admissionDate),
        allergies: Array.isArray(data.allergies)
          ? data.allergies
          : data.allergies.split(",").map((a: string) => a.trim()),
        // Ensure familyDoctorId is included in the data
        familyDoctorId: data.familyDoctorId,
      },
    });

    res.json(patient);
  } catch (err) {
    console.error("Error creating patient:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    // Ensure the patient exists before trying to update
    const patient = await prisma.patient.findUnique({
      where: { id: Number(id) },
    });

    if (!patient) {
      // return res.status(404).json({ error: "Patient not found" });
      throw new Error("Patient not found.");
    }

    // Update the patient without including the `id` field in `data`
    const updatedPatient = await prisma.patient.update({
      where: { id: Number(id) },
      data: {
        name: data.name,
        dateOfBirth: new Date(data.dateOfBirth),
        gender: data.gender,
        contactNumber: data.contactNumber,
        homeAddress: data.homeAddress,
        allergies: data.allergies,
        bloodType: data.bloodType,
        chronicCondition: data.chronicCondition,
        insurance: data.insurance,
        admissionDate: new Date(data.admissionDate),
        condition: data.condition,
        familyDoctorId: data.familyDoctorId,
      },
    });

    res.json(updatedPatient);
  } catch (error) {
    console.error("Error updating patient:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  const patient = await prisma.patient.delete({
    where: { id: Number(req.params.id) },
  });
  res.json(patient);
});

export default router;
