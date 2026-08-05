"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import api from "@/lib/axios";

import VideoPlayer from "../VideoPlayer";
import LessonContent from "../LessonContent";
import LessonNavigation from "../LessonNavigation";

import { CourseDetail } from "@/types/lms";

interface Props {
  course: CourseDetail;
  lessonId: number;
}

export default function LearnCourseClient({
  course,
  lessonId,
}: Props) {
  const router = useRouter();

  const [completedLessonIds, setCompletedLessonIds] = useState<number[]>([]);

  const [markingComplete, setMarkingComplete] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPage();
  }, [course.slug, lessonId]);

  async function loadPage() {
  setLoading(true);
  setError(null);

  try {
    const enrollments = await api.get("/enrollments/");

    const enrollment = enrollments.data.find(
      (e: any) => e.course.slug === course.slug
    );

    if (enrollment) {
      setCompletedLessonIds(
        enrollment.completed_lesson_ids ?? []
      );
    } else {
      setCompletedLessonIds([]);
    }
  } catch (err) {
    console.error(err);
    setError("Unable to load enrollment progress. Please try again.");
  } finally {
    setLoading(false);
  }
}

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-8 rounded-xl border bg-red-50 text-red-700">
        <h2 className="text-xl font-semibold">
          Error loading lesson
        </h2>
        <p className="mt-2">{error}</p>
      </div>
    );
  }

  const allLessons = course.chapters.flatMap(
    (chapter) => chapter.lessons
  );

  const currentLesson = allLessons.find(
    (lesson) => lesson.id === lessonId
  );

  if (!currentLesson) {
    return <div>Lesson not found.</div>;
  }

  const currentIndex = allLessons.findIndex(
    (lesson) => lesson.id === lessonId
  );

  const previousLesson =
    currentIndex > 0
      ? allLessons[currentIndex - 1]
      : null;

  const nextLesson =
    currentIndex < allLessons.length - 1
      ? allLessons[currentIndex + 1]
      : null;

  async function markComplete() {
  if (completedLessonIds.includes(lessonId)) return;

  try {
    setMarkingComplete(true);

    await api.post(`/lessons/${lessonId}/complete/`);

    await loadPage();

    if (nextLesson) {
      setTimeout(() => {
        router.push(
          `/students/learn/${course.slug}/${nextLesson.id}`
        );
      }, 1000);
    }

  } catch (err) {
    console.error(err);
  } finally {
    setMarkingComplete(false);
  }
}

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <main className="flex-1 overflow-y-auto">
        <VideoPlayer lesson={currentLesson} />

        <LessonContent
          lesson={currentLesson}
          course={course}
          completedLessonIds={completedLessonIds}
        />

        <LessonNavigation
    slug={course.slug}
    currentLessonId={currentLesson.id}
    previousLesson={previousLesson}
    nextLesson={nextLesson}
    completed={completedLessonIds.includes(currentLesson.id)}
    loading={markingComplete}
    onMarkComplete={markComplete}
/>
      </main>
    </div>
  );
}