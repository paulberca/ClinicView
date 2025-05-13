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

router.get("/monitored-users", async (req, res) => {
  try {
    const users = await prisma.monitoredUser.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            email: true, // get only the email
          },
        },
      },
    });

    // Transform response to show email instead of userId
    const response = users.map((entry) => ({
      email: entry.user?.email ?? "Unknown",
      reason: entry.reason,
      createdAt: entry.createdAt,
    }));

    res.json(response);
  } catch (err) {
    console.error("Error fetching monitored users:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
