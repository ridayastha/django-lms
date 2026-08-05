import { notFound } from "next/navigation";
import { getCourseBySlugOrId } from "@/lib/api";
import LearnCourseClient from "./LearnCourseClient";

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

  if (!course) notFound();

  return (
    <LearnCourseClient
      course={course}
      lessonId={Number(lessonId)}
    />
  );
}