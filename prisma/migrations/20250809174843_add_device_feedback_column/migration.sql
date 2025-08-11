-- CreateTable
CREATE TABLE "DeviceFeedback" (
    "id" SERIAL NOT NULL,
    "user" TEXT NOT NULL,
    "battery" INTEGER NOT NULL,
    "brand" TEXT NOT NULL,
    "modelName" TEXT NOT NULL,
    "deviceName" TEXT NOT NULL,
    "deviceType" TEXT NOT NULL,
    "osVersion" TEXT NOT NULL,
    "totalMemory" INTEGER NOT NULL,
    "extraInfo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeviceFeedback_pkey" PRIMARY KEY ("id")
);
