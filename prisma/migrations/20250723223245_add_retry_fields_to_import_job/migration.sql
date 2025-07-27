-- AlterTable
ALTER TABLE "ImportJob" ADD COLUMN     "lastRetriedAt" TIMESTAMP(3),
ADD COLUMN     "retryCount" INTEGER NOT NULL DEFAULT 0;
