/*
  Warnings:

  - Added the required column `createdBy` to the `FAQ` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FAQ" ADD COLUMN     "createdBy" TEXT NOT NULL;
