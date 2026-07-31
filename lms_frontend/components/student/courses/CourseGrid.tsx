import CourseCard from "./CourseCard";
import { CourseListItem } from "@/types/lms";

interface Props {
  courses: CourseListItem[];
}

export default function CourseGrid({ courses }: Props) {
  if (courses.length === 0) {
    return (
      <div className="rounded-lg border p-12 text-center text-muted-foreground">
        No courses available.
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {courses.map((course) => (
        <CourseCard
          key={course.slug}
          course={course}
        />
      ))}
    </div>
  );
}