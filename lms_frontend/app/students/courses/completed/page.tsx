"use client";

import { useEffect, useState } from "react";
import { getEnrolledCourses } from "@/lib/api";
import EnrolledCourseGrid from "@/components/student/courses/EnrolledCourseGrid";

export default function CompletedCoursesPage() {
  const [completedCourses, setCompletedCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCompletedCourses() {
      try {
        const data = await getEnrolledCourses();
        const completed = Array.isArray(data)
          ? data.filter((enrollment) => enrollment.is_completed)
          : [];
        setCompletedCourses(completed);
      } catch (error) {
        console.error("Failed to load completed courses", error);
        setCompletedCourses([]);
      } finally {
        setLoading(false);
      }
    }

    loadCompletedCourses();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        Loading completed courses...
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Completed Courses</h1>
        <p className="text-muted-foreground">
          Review your finished courses and revisit completed lessons anytime.
        </p>
      </div>

      <EnrolledCourseGrid enrollments={completedCourses} />
    </div>
  );
}
