-- CreateTable
CREATE TABLE "MonitoredUser" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MonitoredUser_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MonitoredUser" ADD CONSTRAINT "MonitoredUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
