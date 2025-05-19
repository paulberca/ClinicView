import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.sendStatus(401);
    return;
  }

  try {
    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, JWT_SECRET as string);
    (req as any).user = payload;
    next();
  } catch {
    res.sendStatus(403);
  }
}


export function requireRole(role: "ADMIN" | "DOCTOR") {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (user.role !== role) return res.sendStatus(403);
    next();
  };
}
