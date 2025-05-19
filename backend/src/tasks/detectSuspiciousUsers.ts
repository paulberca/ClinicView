import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function detectSuspiciousUsers() {
  const timeWindowMinutes = 1;
  const maxAllowedActions = 1;
  const since = new Date(Date.now() - timeWindowMinutes * 60 * 1000);

  const results = await prisma.activityLog.groupBy({
    by: ["userId"],
    where: { timestamp: { gte: since } },
    _count: { _all: true },
  });

  let detected = false;

  for (const entry of results) {
    if (entry._count._all > maxAllowedActions) {
      detected = true;

      const reasonText = `Performed ${entry._count._all} actions in ${timeWindowMinutes} minutes`;

      const existing = await prisma.monitoredUser.findFirst({
        where: { userId: entry.userId },
      });

      if (!existing) {
        await prisma.monitoredUser.create({
          data: {
            userId: entry.userId,
            reason: reasonText,
          },
        });
        console.warn(
          `Suspicious activity: User ${entry.userId} logged ${entry._count._all} actions.`
        );
      } else {
        await prisma.monitoredUser.update({
          where: { id: existing.id },
          data: {
            reason: reasonText,
            createdAt: new Date(), // Update timestamp
          },
        });
        console.warn(
          `Updated suspicious activity: User ${entry.userId} now has ${entry._count._all} actions.`
        );
      }
    }
  }

  if (detected) {
    console.log("Suspicious users detected and updated.");
  } else {
    console.log("No suspicious users detected.");
  }
}
