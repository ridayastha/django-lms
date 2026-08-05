import { BookOpen, CheckCircle2, Clock3, Award } from "lucide-react";
import type { Enrollment } from "@/types/lms";

interface StudentStatsProps {
  enrollments?: Enrollment[];
}

export default function StudentStats({ enrollments = [] }: StudentStatsProps) {
  const enrolledCourses = enrollments.length;
  const courseCompleted = enrollments.filter((enrollment) => enrollment.is_completed).length;
  const completedLessons = enrollments.reduce(
    (sum, enrollment) => sum + enrollment.completed_lessons,
    0
  );
  const averageProgress = enrolledCourses
    ? Math.round(
        enrollments.reduce((sum, enrollment) => sum + enrollment.progress, 0) /
          enrolledCourses
      )
    : 0;

  const stats = [
    {
      title: "Enrolled Courses",
      value: enrolledCourses,
      icon: BookOpen,
    },
    {
      title: "Courses Completed",
      value: courseCompleted,
      icon: CheckCircle2,
    },
    {
      title: "Lessons Completed",
      value: completedLessons,
      icon: Clock3,
    },
    {
      title: "Average Progress",
      value: `${averageProgress}%`,
      icon: Award,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="bg-primary-foreground p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {item.title}
              </p>

              <Icon className="h-5 w-5 text-primary" />
            </div>

            <h2 className="mt-4 text-3xl font-bold">
              {item.value}
            </h2>
          </div>
        );
      })}
    </div>
  );
}