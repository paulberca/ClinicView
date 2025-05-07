import express from "express";
import { prisma } from "../prisma";
import { Prisma } from "@prisma/client";

const router = express.Router();

// Get a list of doctors
router.get("/", async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = req.query.search as string;
  const sortBy = req.query.sortBy as string; // e.g., "specialty"
  const sortOrder = (req.query.sortOrder as string) === "desc" ? "desc" : "asc";
  const skip = (page - 1) * limit;

  const where: Prisma.FamilyDoctorWhereInput = search
    ? {
        name: {
          contains: search,
          mode: Prisma.QueryMode.insensitive,
        },
      }
    : {};

  // Default sort by ID if no valid sortBy is given
  const validSortFields = ["specialty"];
  const orderBy: Prisma.FamilyDoctorOrderByWithRelationInput =
    validSortFields.includes(sortBy) ? { [sortBy]: sortOrder } : { id: "asc" };

  const doctors = await prisma.familyDoctor.findMany({
    where,
    skip,
    take: limit,
    orderBy,
  });

  res.json(doctors);
});

// Get a single doctor by ID
router.get("/:id", async (req, res) => {
  const doctor = await prisma.familyDoctor.findUnique({
    where: { id: Number(req.params.id) },
  });
  res.json(doctor);
});

// Create a new doctor
router.post("/", async (req, res) => {
  try {
    const data = req.body;

    const doctor = await prisma.familyDoctor.create({
      data,
    });

    res.json(doctor);
  } catch (err) {
    console.error("Error creating doctor:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update a doctor's details
router.put("/:id", async (req, res) => {
  const data = req.body;
  const doctor = await prisma.familyDoctor.update({
    where: { id: Number(req.params.id) },
    data,
  });
  res.json(doctor);
});

// Delete a doctor
router.delete("/:id", async (req, res) => {
  const doctorId = Number(req.params.id);

  try {
    // Find the doctor to be deleted
    const doctorToDelete = await prisma.familyDoctor.findUnique({
      where: { id: doctorId },
      include: { patients: true }, // Optional: to check if patients are associated
    });

    if (!doctorToDelete) {
      throw new Error("Doctor not found.");
    }

    const newDoctor = await prisma.familyDoctor.findFirst({
      where: { id: { not: doctorId } },
    });

    if (!newDoctor) {
      throw new Error("No other doctor available to reassign patients.");
    }

    // Update all patients associated with the doctor to a new doctor
    await prisma.patient.updateMany({
      where: { familyDoctorId: doctorId },
      data: { familyDoctorId: newDoctor.id },
    });

    // Delete the doctor
    const doctor = await prisma.familyDoctor.delete({
      where: { id: doctorId },
    });

    res.json({ message: "Doctor deleted and patients reassigned", doctor });
  } catch (err) {
    console.error("Error deleting doctor:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
