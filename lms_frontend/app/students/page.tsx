"use client";
import StudentStats from "@/components/student/StudentStats";
import TodoList from "@/components/TodoList";
import StudentCourseProgressChart from "@/components/student/ProgressChart";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { DynamicBreadcrumb } from "@/components/DynamicBreadCrumb";

export default function StudentDashboard() {
  return (
    <div className="p-6 space-y-6">
      <div>
          <DynamicBreadcrumb/>
      </div>
      <div>
        <h1 className="text-3xl font-bold">Welcome back, Student!</h1>
        <p className="text-muted-foreground">
          Keep up the great work. You're almost done with your current course.
        </p>
      </div>

      {/* Stats & Todo Section */}
      <div className="space-y-6">
        <StudentStats />
        <TodoList />
      </div>

      {/* Analytics & Deadlines Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Course Progress Chart */}
        <StudentCourseProgressChart />

        {/* Upcoming Deadlines Placeholder */}
        <div className="col-span-3 bg-muted/20 border rounded-xl p-6 h-[320px] flex items-center justify-center text-sm text-muted-foreground">
          [ Upcoming Deadlines Coming Soon ]
        </div>
      </div>
    </div>
  );
}