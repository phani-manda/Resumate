/**
 * API Validation Schemas - Resumate
 * Production-grade Zod schemas for all API routes
 * 
 * Never use raw req.json() - always validate with these schemas
 */

import { z } from "zod";

// ============================================================================
// PERSONAL INFO SCHEMAS
// ============================================================================

export const PersonalInfoSchema = z.object({
  fullName: z.string().min(1, "Name is required").max(100).trim(),
  email: z.string().email("Invalid email address").max(200),
  phone: z
    .string()
    .regex(/^[+\d\s()-]{7,20}$/, "Invalid phone number")
    .optional()
    .or(z.literal("")),
  location: z.string().max(100).optional(),
  linkedin: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
  portfolio: z.string().url("Invalid portfolio URL").optional().or(z.literal("")),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  title: z.string().max(150).optional(),
});

// ============================================================================
// EXPERIENCE SCHEMAS
// ============================================================================

export const ExperienceSchema = z.object({
  id: z.string(),
  company: z.string().min(1, "Company name is required").max(200),
  position: z.string().min(1, "Position is required").max(200),
  startDate: z.string().regex(/^\d{4}-\d{2}$/, "Use YYYY-MM format"),
  endDate: z.string(), // Can be "Present" or YYYY-MM
  description: z.string().max(3000),
  location: z.string().max(100).optional(),
  current: z.boolean().optional(),
});

// ============================================================================
// EDUCATION SCHEMAS
// ============================================================================

export const EducationSchema = z.object({
  id: z.string(),
  institution: z.string().min(1, "Institution is required").max(200),
  degree: z.string().min(1, "Degree is required").max(200),
  field: z.string().max(200).optional(),
  startDate: z.string(),
  endDate: z.string(),
  gpa: z.string().max(10).optional(),
  description: z.string().max(2000).optional(),
});

// ============================================================================
// PROJECT SCHEMAS
// ============================================================================

export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Project name is required").max(200),
  description: z.string().max(2000),
  technologies: z.array(z.string().max(50)).max(20).optional(),
  url: z.string().url().optional().or(z.literal("")),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

// ============================================================================
// RESUME SCHEMAS
// ============================================================================

export const CreateResumeSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  personalInfo: PersonalInfoSchema,
  summary: z.string().max(2000).optional(),
  experiences: z.array(ExperienceSchema).max(20),
  education: z.array(EducationSchema).max(10),
  projects: z.array(ProjectSchema).max(20).optional(),
  skills: z.array(z.string().max(50)).max(100),
  sectionOrder: z.array(z.string()).optional(),
  targetRole: z.string().max(200).optional(),
});

export const UpdateResumeSchema = CreateResumeSchema.partial();

// ============================================================================
// OPTIMIZATION SCHEMAS
// ============================================================================

export const OptimizeRequestSchema = z.object({
  resumeText: z.string().min(50, "Resume text too short").max(50000),
  jobDescription: z.string().min(100, "Job description must be at least 100 characters").max(20000),
  resumeId: z.string().optional(),
});

export const OptimizationResultSchema = z.object({
  atsScore: z.number().int().min(0).max(100),
  keywordsToAdd: z.array(z.string()).max(50),
  matchedKeywords: z.array(z.string()).max(100),
  suggestions: z.array(z.string().max(500)).min(1).max(10),
});

// ============================================================================
// CHAT SCHEMAS
// ============================================================================

export const ChatMessageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string().min(1).max(10000),
});

export const ChatRequestSchema = z.object({
  messages: z.array(ChatMessageSchema).min(1).max(100),
  resumeContext: z.string().max(50000).optional(),
  sessionId: z.string().optional(),
});

// ============================================================================
// IMPROVE SECTION SCHEMAS
// ============================================================================

export const ImproveSectionSchema = z.object({
  sectionType: z.enum([
    "summary",
    "experience",
    "education",
    "project",
    "skills",
  ]),
  content: z.string().min(10).max(5000),
  tone: z.enum(["formal", "concise", "detailed"]).default("formal"),
  context: z.string().max(2000).optional(),
});

// ============================================================================
// FILE UPLOAD SCHEMAS
// ============================================================================

export const FileUploadSchema = z.object({
  filename: z.string().max(255),
  mimeType: z.enum([
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
    "text/plain",
  ]),
  size: z.number().max(10 * 1024 * 1024, "File size must be less than 10MB"),
});

// ============================================================================
// USER ACTIVITY SCHEMAS
// ============================================================================

export const UserActivitySchema = z.object({
  action: z.enum([
    "resume_created",
    "resume_updated",
    "resume_deleted",
    "optimized",
    "chat",
    "exported",
    "resume_viewed",
    "login",
    "signup",
  ]),
  metadata: z.record(z.any()).optional(),
});

// ============================================================================
// DASHBOARD SCHEMAS
// ============================================================================

export const DashboardStatsRequestSchema = z.object({
  dateRange: z.enum(["7d", "30d", "90d", "all"]).default("30d"),
});

// ============================================================================
// SHARE RESUME SCHEMAS
// ============================================================================

export const ShareResumeSchema = z.object({
  resumeId: z.string(),
  expiresIn: z.enum(["1h", "24h", "7d", "30d", "never"]).default("7d"),
  allowDownload: z.boolean().default(true),
});

// ============================================================================
// VERSION HISTORY SCHEMAS
// ============================================================================

export const CreateVersionSchema = z.object({
  resumeId: z.string(),
  label: z.string().max(100).optional(),
});

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type PersonalInfo = z.infer<typeof PersonalInfoSchema>;
export type Experience = z.infer<typeof ExperienceSchema>;
export type Education = z.infer<typeof EducationSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type CreateResume = z.infer<typeof CreateResumeSchema>;
export type UpdateResume = z.infer<typeof UpdateResumeSchema>;
export type OptimizeRequest = z.infer<typeof OptimizeRequestSchema>;
export type OptimizationResult = z.infer<typeof OptimizationResultSchema>;
export type ChatMessage = z.infer<typeof ChatMessageSchema>;
export type ChatRequest = z.infer<typeof ChatRequestSchema>;
export type ImproveSection = z.infer<typeof ImproveSectionSchema>;
export type FileUpload = z.infer<typeof FileUploadSchema>;
export type UserActivity = z.infer<typeof UserActivitySchema>;
