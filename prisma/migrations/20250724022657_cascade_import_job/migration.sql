-- DropForeignKey
ALTER TABLE "ImportJob" DROP CONSTRAINT "ImportJob_orgId_fkey";

-- AddForeignKey
ALTER TABLE "ImportJob" ADD CONSTRAINT "ImportJob_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
