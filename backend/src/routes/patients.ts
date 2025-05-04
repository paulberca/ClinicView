import express from "express";
import { prisma } from "../prisma";
import { Prisma } from "@prisma/client";

const router = express.Router();

router.get("/", async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = req.query.search as string;
  const skip = (page - 1) * limit;

  const where: Prisma.PatientWhereInput = search
    ? {
        name: {
          contains: search,
          mode: Prisma.QueryMode.insensitive,
        },
      }
    : {};

  const patients = await prisma.patient.findMany({
    where,
    skip,
    take: limit,
    orderBy: { id: "asc" },
  });

  res.json(patients);
});

router.get("/:id", async (req, res) => {
  const patient = await prisma.patient.findUnique({
    where: { id: Number(req.params.id) },
  });
  res.json(patient);
});

router.post("/", async (req, res) => {
  const data = req.body;
  const patient = await prisma.patient.create({
    data: {
      ...data,
      dateOfBirth: new Date(data.dateOfBirth),
      admissionDate: new Date(data.admissionDate),
    },
  });
  res.json(patient);
});

router.put("/:id", async (req, res) => {
  const data = req.body;
  const patient = await prisma.patient.update({
    where: { id: Number(req.params.id) },
    data: {
      ...data,
      dateOfBirth: new Date(data.dateOfBirth),
      admissionDate: new Date(data.admissionDate),
    },
  });
  res.json(patient);
});

router.delete("/:id", async (req, res) => {
  const patient = await prisma.patient.delete({
    where: { id: Number(req.params.id) },
  });
  res.json(patient);
});

export default router;
