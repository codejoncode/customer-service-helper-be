-- CreateTable
CREATE TABLE "MemberValidationLog" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "providedData" JSONB NOT NULL,
    "results" JSONB NOT NULL,
    "valid" BOOLEAN NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MemberValidationLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MemberValidationLog" ADD CONSTRAINT "MemberValidationLog_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
