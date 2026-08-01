import { notFound } from "next/navigation";
import { getCourseBySlugOrId } from "@/lib/api";
import VideoPlayer from "../VideoPlayer";
import LessonContent from "../LessonContent";
import LessonNavigation from "../LessonNavigation";

interface PageProps {
  params: Promise<{
    slug: string;
    lessonId: string;
  }>;
}

export default async function LearnCoursePage({
  params,
}: PageProps) {
  const { slug, lessonId } = await params;

  let course;

  try {
    course = await getCourseBySlugOrId(slug);
  } catch {
    notFound();
  }

  if (!course) {
    notFound();
  }

  // Flatten all lessons into a single array
  const allLessons = course.chapters.flatMap((chapter) => chapter.lessons);

  if (allLessons.length === 0) {
    return (
      <div className="p-8">
        This course has no lessons yet.
      </div>
    );
  }

  // Find the current lesson from the URL
  const currentLesson = allLessons.find(
    (lesson) => lesson.id === Number(lessonId)
  );

  if (!currentLesson) {
    notFound();
  }

  // Find current lesson index
  const currentIndex = allLessons.findIndex(
    (lesson) => lesson.id === currentLesson.id
  );

  // Previous lesson
  const previousLesson =
    currentIndex > 0 ? allLessons[currentIndex - 1] : null;

  // Next lesson
  const nextLesson =
    currentIndex < allLessons.length - 1
      ? allLessons[currentIndex + 1]
      : null;

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      

      <main className="flex-1 overflow-y-auto">
        <VideoPlayer lesson={currentLesson} />

        <LessonContent
  lesson={currentLesson}
  course={course}
  completedLessonIds={[]}
/>

        <LessonNavigation
          slug={course.slug}
          previousLesson={previousLesson}
          nextLesson={nextLesson}
        />
      </main>
    </div>
  );
}