// types/lms.ts

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'student' | 'teacher' | 'admin';
  bio?: string;
  profile_picture?: string;
  phone_number?: string;
}

export interface TeacherProfile {
  id: number;
  user: User;
  qualification: string;
  expertise: string;
  website?: string;
}

export interface Category {
  id: number;
  title: string;
  slug: string;
  description?: string;
  icon?: string;
}

export interface LessonAttachment {
  id: number;
  title: string;
  file: string;
}

export interface Lesson {
  id: number;
  chapter: number;
  title: string;
  video_url?: string;
  content?: string;
  duration_minutes: number;
  is_preview: boolean;
  order: number;
  attachments: LessonAttachment[];
}

export interface Chapter {
  id: number;
  course: number;
  title: string;
  order: number;
  lessons: Lesson[];
}

// Matches CourseListSerializer output
export interface CourseListItem {
  id: number;
  title: string;
  slug: string;
  category: string | null;  // DRF string from to_representation
  teacher: string | null;   // DRF full name from to_representation
  featured_img: string | null;
  level: string;
  price: string;
  is_published: boolean;
}

// Matches CourseDetailSerializer output
export interface CourseDetail {
  id: number;
  title: string;
  slug: string;
  description: string;
  category: Category | null;
  teacher: TeacherProfile | null;
  featured_img: string | null;
  level: string;
  price: string;
  is_published: boolean;
  chapters: Chapter[];
  created_at: string;
  updated_at: string;
}