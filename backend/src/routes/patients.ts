import express from "express";
import { prisma } from "../prisma";
import { Prisma } from "@prisma/client";
import { authenticate } from "../middleware/auth";
import { logActivity } from "../middleware/logActivity";

const router = express.Router();

router.get("/", authenticate, async (req, res) => {
  const user = (req as any).user;

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 1000;
  const search = req.query.search as string;
  const sortBy = req.query.sortBy as string;
  const sortOrder = (req.query.sortOrder as string) === "desc" ? "desc" : "asc";
  const skip = (page - 1) * limit;

  const where: Prisma.PatientWhereInput = {
    ...(search && {
      name: { contains: search, mode: Prisma.QueryMode.insensitive },
    }),
    ...(user.role === "DOCTOR" && {
      familyDoctor: { userId: user.userId },
    }),
  };

  const validSortFields = ["condition", "admissionDate"];
  const orderBy: Prisma.PatientOrderByWithRelationInput =
    validSortFields.includes(sortBy) ? { [sortBy]: sortOrder } : { id: "asc" };

  const patients = await prisma.patient.findMany({
    where,
    skip,
    take: limit,
    orderBy,
    include: {
      familyDoctor: { select: { id: true, name: true } },
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

router.post("/", authenticate, async (req, res) => {
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

    await logActivity({
      userId: (req as any).user.userId,
      action: "CREATE",
      entity: "Patient",
      entityId: patient.id,
    });

    res.json(patient);
  } catch (err) {
    console.error("Error creating patient:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", authenticate, async (req, res) => {
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

    await logActivity({
      userId: (req as any).user.userId,
      action: "UPDATE",
      entity: "Patient",
      entityId: Number(id),
    });

    res.json(updatedPatient);
  } catch (error) {
    console.error("Error updating patient:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", authenticate, async (req, res) => {
  const patient = await prisma.patient.delete({
    where: { id: Number(req.params.id) },
  });

  await logActivity({
    userId: (req as any).user.userId,
    action: "DELETE",
    entity: "Patient",
    entityId: Number(req.params.id),
  });

  res.json(patient);
});

export default router;
