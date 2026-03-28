"use client";

import useSWR, { mutate } from "swr";

// Generic fetcher
const fetcher = async <T>(url: string): Promise<T> => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.");
    throw error;
  }
  return res.json();
};

// ============================================================================
// RESUME TYPES
// ============================================================================

interface PersonalInfo {
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  portfolio?: string;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field?: string;
  startDate: string;
  endDate: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  technologies?: string[];
  url?: string;
}

export interface Resume {
  id: string;
  title?: string;
  personalInfo: PersonalInfo;
  summary?: string;
  experiences: Experience[];
  education: Education[];
  projects?: Project[];
  skills: string[];
  sectionOrder?: string[];
  templateId?: string;
  targetRole?: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// useResumes Hook
// ============================================================================

interface UseResumesOptions {
  includeArchived?: boolean;
}

export function useResumes(options: UseResumesOptions = {}) {
  const { includeArchived = false } = options;
  const url = `/api/resumes${includeArchived ? "?includeArchived=true" : ""}`;

  const { data, error, isLoading, isValidating } = useSWR<Resume[]>(
    url,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 5000,
      onError: (err) => console.error("Resume fetch failed:", err),
    }
  );

  // Optimistic create
  const createResume = async (resumeData: Partial<Resume>) => {
    const optimisticResume: Resume = {
      id: `temp-${Date.now()}`,
      title: resumeData.title || "Untitled Resume",
      personalInfo: resumeData.personalInfo || {
        fullName: "",
        email: "",
      },
      summary: resumeData.summary || "",
      experiences: resumeData.experiences || [],
      education: resumeData.education || [],
      projects: resumeData.projects || [],
      skills: resumeData.skills || [],
      sectionOrder: resumeData.sectionOrder || [],
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Optimistic update
    const previousResumes = data || [];
    mutate(url, [optimisticResume, ...previousResumes], false);

    try {
      const res = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resumeData),
      });

      if (!res.ok) throw new Error("Failed to create resume");

      const newResume = await res.json();

      // Update with real data
      mutate(
        url,
        previousResumes.map((r) =>
          r.id === optimisticResume.id ? newResume : r
        )
      );

      return newResume;
    } catch (error) {
      // Rollback on error
      mutate(url, previousResumes);
      throw error;
    }
  };

  // Optimistic update
  const updateResume = async (id: string, updates: Partial<Resume>) => {
    const previousResumes = data || [];
    const updatedResumes = previousResumes.map((r) =>
      r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r
    );

    mutate(url, updatedResumes, false);

    try {
      const res = await fetch(`/api/resumes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!res.ok) throw new Error("Failed to update resume");

      const updated = await res.json();
      mutate(
        url,
        previousResumes.map((r) => (r.id === id ? updated : r))
      );

      return updated;
    } catch (error) {
      mutate(url, previousResumes);
      throw error;
    }
  };

  // Optimistic delete
  const deleteResume = async (id: string) => {
    const previousResumes = data || [];
    mutate(
      url,
      previousResumes.filter((r) => r.id !== id),
      false
    );

    try {
      const res = await fetch(`/api/resumes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete resume");
    } catch (error) {
      mutate(url, previousResumes);
      throw error;
    }
  };

  // Archive resume (soft delete)
  const archiveResume = async (id: string) => {
    return updateResume(id, { isArchived: true });
  };

  // Restore archived resume
  const restoreResume = async (id: string) => {
    return updateResume(id, { isArchived: false });
  };

  return {
    resumes: data ?? [],
    error,
    isLoading,
    isValidating,
    createResume,
    updateResume,
    deleteResume,
    archiveResume,
    restoreResume,
    refresh: () => mutate(url),
  };
}

// ============================================================================
// useSingleResume Hook
// ============================================================================

export function useResume(id: string | null) {
  const { data, error, isLoading } = useSWR<Resume>(
    id ? `/api/resumes/${id}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  const updateResume = async (updates: Partial<Resume>) => {
    if (!id) return;

    const previous = data;
    const updated = { ...data, ...updates, updatedAt: new Date().toISOString() };

    mutate(`/api/resumes/${id}`, updated, false);

    try {
      const res = await fetch(`/api/resumes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!res.ok) throw new Error("Failed to update resume");

      const result = await res.json();
      mutate(`/api/resumes/${id}`, result);

      // Also update the list cache
      mutate("/api/resumes");

      return result;
    } catch (error) {
      mutate(`/api/resumes/${id}`, previous);
      throw error;
    }
  };

  return {
    resume: data,
    error,
    isLoading,
    updateResume,
    refresh: () => mutate(`/api/resumes/${id}`),
  };
}

export default useResumes;
