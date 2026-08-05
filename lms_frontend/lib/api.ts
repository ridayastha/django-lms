// lib/api.ts
import { CourseListItem, CourseDetail, Category } from '@/types/lms';
import api from "./axios";

// Ensure base URL has no trailing slash to prevent double slashes (e.g. /api//courses)
const RAW_API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
const API_BASE = RAW_API_BASE.replace(/\/$/, '');

export async function getCourses(): Promise<CourseListItem[]> {
  const res = await fetch(`${API_BASE}/courses/`, {
    next: { revalidate: 10 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch course catalog: ${res.statusText}`);
  }

  return res.json();
}

export async function getCourseBySlugOrId(idOrSlug: string): Promise<CourseDetail> {
  const res = await fetch(`${API_BASE}/courses/${idOrSlug}/`, {
    next: { revalidate: 10 },
  });

  if (res.status === 404) {
    throw new Error('COURSE_NOT_FOUND');
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch course details for "${idOrSlug}": ${res.statusText}`);
  }

  return res.json();
}

export async function getEnrolledCourses() {
  const { data } = await api.get("/enrollments/");
  return data;
}

export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${API_BASE}/categories/`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch categories: ${res.statusText}`);
  }

  return res.json();
}

export async function completeLesson(
  lessonId: number,
  accessToken: string
) {
  const res = await fetch(`${API_BASE}/lessons/${lessonId}/complete/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to complete lesson");
  }

  return res.json();
}

export async function getMyEnrollments(token: string) {
  const res = await fetch(`${API_BASE}/enrollments/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch enrollments");
  }

  return res.json();
}