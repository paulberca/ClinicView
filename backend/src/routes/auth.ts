import { Router } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma";
import { authenticate } from "../middleware/auth";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

router.post("/register", async (req, res) => {
  const { email, password, role } = req.body;

  // Store password as plaintext in the database
  const user = await prisma.user.create({
    data: { email, password, role },
  });

  res.json(user);
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  console.log("Login attempt with email:", email);
  console.log("Login attempt with password:", password);

  // Find the user by email
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    console.log("User not found");
    // return res.status(401).json({ message: "User not found" });
    throw new Error("User not found");
  }

  // Check if the provided password matches the stored one
  if (user.password !== password) {
    console.log("Password does not match");
    // return res.status(401).json({ message: "Password does not match" });
    throw new Error("Password does not match");
  }

  // Generate a JWT token
  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({ token });
});

router.get("/me", authenticate, (req, res) => {
  const user = (req as any).user;
  res.json({ role: user.role });
});

router.get("/logs", authenticate, async (req, res) => {
  const user = (req as any).user;
  if (user.role !== "ADMIN") {
    // return res.status(403).json({ error: "Access denied" });
    throw new Error("Access denied");
  }

  const logs = await prisma.activityLog.findMany({
    include: { user: { select: { email: true } } },
    orderBy: { timestamp: "desc" },
  });

  res.json(logs);
});

export default router;
