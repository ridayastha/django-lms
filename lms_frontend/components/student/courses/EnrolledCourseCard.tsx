"use client";

import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function EnrolledCourseCard({
  enrollment,
}: any) {
  const course = enrollment.course;
  const courseImage =
    course.featured_img ||
    "/placeholders/default-image.svg";

  return (
    <div className="border bg-card shadow-sm overflow-hidden">

      <Image
        src={courseImage}
        alt={course.title}
        width={600}
        height={300}
        loading="eager"
        className="h-48 w-full object-cover"
      />

      <div className="space-y-4 p-5">

        <div>
          <h3 className="font-semibold text-lg">
            {course.title}
          </h3>

          <p className="text-sm text-muted-foreground">
            {course.teacher}
          </p>
        </div>

        <Progress value={enrollment.progress} />

        <div className="flex justify-between text-sm">

          <span>
            {enrollment.completed_lessons}/
            {enrollment.total_lessons}
            {" "}Lessons
          </span>

          <span>
            {enrollment.progress}%
          </span>

        </div>

        <Button asChild className="w-full">
  <Link
    href={
      enrollment.next_lesson
        ? `/students/learn/${course.slug}/${enrollment.next_lesson.id}`
        : `/students/courses/${course.slug}`
    }
  >
    {enrollment.next_lesson ? "Continue Learning" : "Review Course"}
  </Link>
</Button>
      </div>

    </div>
  );
}