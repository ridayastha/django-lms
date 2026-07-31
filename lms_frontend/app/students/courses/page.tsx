import { getCourses } from "@/lib/api";

import CourseGrid from "@/components/student/courses/CourseGrid";

export default async function ExploreCoursesPage() {
  const courses = await getCourses();

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">
          Explore Courses
        </h1>

        <p className="text-muted-foreground">
          Browse our complete catalog of courses.
        </p>
      </div>

      <CourseGrid courses={courses} />
    </div>
  );
}