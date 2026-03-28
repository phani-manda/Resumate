/*
  Warnings:

  - A unique constraint covering the columns `[clerkUserId,title]` on the table `Resume` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ChatMessage" ADD COLUMN     "reaction" TEXT,
ADD COLUMN     "sessionId" TEXT;

-- AlterTable
ALTER TABLE "OptimizationReport" ADD COLUMN     "companyName" TEXT,
ADD COLUMN     "improvements" JSONB,
ADD COLUMN     "jobTitle" TEXT;

-- AlterTable
ALTER TABLE "Resume" ADD COLUMN     "isArchived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sectionOrder" TEXT[],
ADD COLUMN     "targetRole" TEXT,
ADD COLUMN     "templateId" TEXT,
ADD COLUMN     "title" TEXT;

-- CreateTable
CREATE TABLE "ResumeVersion" (
    "id" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "snapshot" JSONB NOT NULL,
    "label" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResumeVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResumeView" (
    "id" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "viewerIp" TEXT NOT NULL,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResumeView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserActivity" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSettings" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "plan" TEXT NOT NULL DEFAULT 'free',
    "onboardingStep" INTEGER NOT NULL DEFAULT 0,
    "onboardingDone" BOOLEAN NOT NULL DEFAULT false,
    "preferredTone" TEXT NOT NULL DEFAULT 'formal',
    "emailNotify" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ResumeVersion_resumeId_createdAt_idx" ON "ResumeVersion"("resumeId", "createdAt");

-- CreateIndex
CREATE INDEX "ResumeView_resumeId_idx" ON "ResumeView"("resumeId");

-- CreateIndex
CREATE INDEX "UserActivity_clerkUserId_createdAt_idx" ON "UserActivity"("clerkUserId", "createdAt");

-- CreateIndex
CREATE INDEX "UserActivity_action_idx" ON "UserActivity"("action");

-- CreateIndex
CREATE UNIQUE INDEX "UserSettings_clerkUserId_key" ON "UserSettings"("clerkUserId");

-- CreateIndex
CREATE INDEX "UserSettings_clerkUserId_idx" ON "UserSettings"("clerkUserId");

-- CreateIndex
CREATE INDEX "ChatMessage_clerkUserId_timestamp_idx" ON "ChatMessage"("clerkUserId", "timestamp");

-- CreateIndex
CREATE INDEX "ChatMessage_sessionId_idx" ON "ChatMessage"("sessionId");

-- CreateIndex
CREATE INDEX "OptimizationReport_clerkUserId_createdAt_idx" ON "OptimizationReport"("clerkUserId", "createdAt");

-- CreateIndex
CREATE INDEX "OptimizationReport_resumeId_idx" ON "OptimizationReport"("resumeId");

-- CreateIndex
CREATE INDEX "Resume_clerkUserId_updatedAt_idx" ON "Resume"("clerkUserId", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Resume_clerkUserId_title_key" ON "Resume"("clerkUserId", "title");

-- AddForeignKey
ALTER TABLE "ResumeVersion" ADD CONSTRAINT "ResumeVersion_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResumeView" ADD CONSTRAINT "ResumeView_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE CASCADE ON UPDATE CASCADE;
