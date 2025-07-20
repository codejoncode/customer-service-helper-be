/*
  Warnings:

  - Added the required column `agentId` to the `MemberValidationLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passed` to the `MemberValidationLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MemberValidationLog" ADD COLUMN     "agentId" TEXT NOT NULL,
ADD COLUMN     "fieldsChecked" TEXT[],
ADD COLUMN     "passed" BOOLEAN NOT NULL;

-- AddForeignKey
ALTER TABLE "MemberValidationLog" ADD CONSTRAINT "MemberValidationLog_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
