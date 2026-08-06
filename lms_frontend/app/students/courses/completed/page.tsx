"use client";

import { useEffect, useState } from "react";
import { getEnrolledCourses } from "@/lib/api";
import EnrolledCourseGrid from "@/components/student/courses/EnrolledCourseGrid";
import { DynamicBreadcrumb } from "@/components/DynamicBreadCrumb";

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
        <DynamicBreadcrumb />
      </div>
      <div>
        <h1 className="text-3xl font-bold">Completed Courses</h1>
        {completedCourses.length > 0 ? (
          <p className="text-muted-foreground">
            Review your finished courses and revisit completed lessons anytime.
          </p>
        ) : (
          <p className="text-muted-foreground">
            You have no completed courses yet.
          </p>
        )}
      </div>

      {completedCourses.length > 0 ? (
        <EnrolledCourseGrid enrollments={completedCourses} />
      ) : (
        <div className="rounded-xl border p-12 text-center">
          <h3 className="text-xl font-semibold">No completed courses yet</h3>
          <p className="text-muted-foreground mt-2">
            Explore courses and start learning today.
          </p>
        </div>
      )}
    </div>
  );
}
