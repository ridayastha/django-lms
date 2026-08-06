"use client";

import { useEffect, useState } from "react";

import { getEnrolledCourses } from "@/lib/api";

import EnrolledCourseGrid from "@/components/student/courses/EnrolledCourseGrid";
import { DynamicBreadcrumb } from "@/components/DynamicBreadCrumb";

export default function EnrolledCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCourses() {
      try {
        const data = await getEnrolledCourses();
        setCourses(data);
      } finally {
        setLoading(false);
      }
    }

    loadCourses();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        Loading your courses...
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <DynamicBreadcrumb />
      </div>
      <div>
        <h1 className="text-3xl font-bold">
          Enrolled Courses
        </h1>

        <p className="text-muted-foreground">
          Continue learning where you left off.
        </p>
      </div>

      <EnrolledCourseGrid
        enrollments={courses}
      />
    </div>
  );
}