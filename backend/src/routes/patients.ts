import express from "express";
import { prisma } from "../prisma";

const router = express.Router();

router.get("/", async (_, res) => {
  const patients = await prisma.patient.findMany();
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
