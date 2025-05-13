import express from "express";
import { prisma } from "../prisma";
import { authenticate } from "../middleware/auth";

const router = express.Router();

// GET /logs — Admin only
router.get("/", authenticate, async (req, res) => {
  const user = (req as any).user;

  if (user.role !== "ADMIN") {
    // return res.status(403).json({ error: "Access denied" });
    throw new Error("Access denied");
  }

  const logs = await prisma.activityLog.findMany({
    orderBy: { timestamp: "desc" },
    include: {
      user: {
        select: { email: true, role: true },
      },
    },
  });

  res.json(logs);
});

export default router;
