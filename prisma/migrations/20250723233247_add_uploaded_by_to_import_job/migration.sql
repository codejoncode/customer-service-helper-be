/*
  Warnings:

  - Added the required column `uploadedBy` to the `ImportJob` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ImportJob" ADD COLUMN     "uploadedBy" TEXT NOT NULL;
