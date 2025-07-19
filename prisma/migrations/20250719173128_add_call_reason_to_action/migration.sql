/*
  Warnings:

  - Added the required column `callReasonId` to the `Action` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Action" ADD COLUMN     "callReasonId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_callReasonId_fkey" FOREIGN KEY ("callReasonId") REFERENCES "CallReason"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_defaultArticleId_fkey" FOREIGN KEY ("defaultArticleId") REFERENCES "Article"("id") ON DELETE SET NULL ON UPDATE CASCADE;
