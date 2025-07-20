/*
  Warnings:

  - Added the required column `email` to the `Agent` table without a default value. This will fail if the table contains rows.
*/

-- AlterTable
ALTER TABLE "Agent" ADD COLUMN "email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Agent_email_key" ON "Agent"("email");