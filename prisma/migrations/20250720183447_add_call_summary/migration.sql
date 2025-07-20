-- CreateTable
CREATE TABLE "CallSummary" (
    "id" SERIAL NOT NULL,
    "callLogId" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "summaryText" TEXT NOT NULL,
    "actionsTaken" TEXT[],
    "notes" TEXT NOT NULL,
    "checklist" TEXT[],
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CallSummary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CallSummary_callLogId_key" ON "CallSummary"("callLogId");

-- AddForeignKey
ALTER TABLE "CallSummary" ADD CONSTRAINT "CallSummary_callLogId_fkey" FOREIGN KEY ("callLogId") REFERENCES "CallLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;
