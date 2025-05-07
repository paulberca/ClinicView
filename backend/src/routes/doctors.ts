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

export default router;
