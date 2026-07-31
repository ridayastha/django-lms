// lib/api.ts
import { CourseListItem, CourseDetail, Category } from '@/types/lms';

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

export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${API_BASE}/categories/`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch categories: ${res.statusText}`);
  }

  return res.json();
}