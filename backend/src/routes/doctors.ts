import express from "express";
import { prisma } from "../prisma";
import { Prisma } from "@prisma/client";

const router = express.Router();

// Fetch a list of family doctors
router.get("/", async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = req.query.search as string;
  const sortBy = req.query.sortBy as string;
  const sortOrder = (req.query.sortOrder as string) === "desc" ? "desc" : "asc"; // default to "asc"
  const skip = (page - 1) * limit;

  const where = search
    ? {
        name: {
          contains: search,
          mode: Prisma.QueryMode.insensitive,
        },
      }
    : {};

  const doctors = await prisma.familyDoctor.findMany({
    where,
    skip,
    take: limit,
    orderBy: sortBy ? { [sortBy]: sortOrder } : { name: "asc" },
  });

  res.json(doctors);
});

// Fetch details for a specific doctor by ID
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
      data: {
        name: data.name,
        specialty: data.specialty,
        contactNumber: data.contactNumber,
      },
    });
    res.status(201).json(doctor);
  } catch (err) {
    console.error("Error creating doctor:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update an existing doctor
router.put("/:id", async (req, res) => {
  try {
    const data = req.body;
    const doctor = await prisma.familyDoctor.update({
      where: { id: Number(req.params.id) },
      data: {
        name: data.name,
        specialty: data.specialty,
        contactNumber: data.contactNumber,
      },
    });
    res.json(doctor);
  } catch (err) {
    console.error("Error updating doctor:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a doctor
router.delete("/:id", async (req, res) => {
  try {
    const doctor = await prisma.familyDoctor.delete({
      where: { id: Number(req.params.id) },
    });
    res.json(doctor);
  } catch (err) {
    console.error("Error deleting doctor:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
