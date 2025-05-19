import { prisma } from "../prisma";

export const logActivity = async ({
  userId,
  action,
  entity,
  entityId,
}: {
  userId: number;
  action: string;
  entity: string;
  entityId?: number;
}) => {
  await prisma.activityLog.create({
    data: {
      userId,
      action,
      entity,
      entityId,
    },
  });
};
