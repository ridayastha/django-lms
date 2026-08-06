"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import StudentStats from "@/components/student/StudentStats";
import TodoList from "@/components/TodoList";
import StudentCourseProgressChart from "@/components/student/ProgressChart";
import { DynamicBreadcrumb } from "@/components/DynamicBreadCrumb";
import { getEnrolledCourses } from "@/lib/api";
import { Enrollment } from "@/types/lms";

// Shadcn UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

// Lucide Icons
import {
  PlayCircle,
  Download,
  ExternalLink,
  FileText,
  Sparkles,
  Calendar as CalendarIcon,
  ArrowRight,
  Code2,
  BookOpen,
  Wrench,
  CheckSquare,
} from "lucide-react";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(true);
  const [enrollmentError, setEnrollmentError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEnrollments() {
      try {
        const data = await getEnrolledCourses();
        setEnrollments(data);
      } catch (error) {
        console.error("Failed to load enrolled courses", error);
        setEnrollmentError("Unable to load your enrolled courses.");
      } finally {
        setLoadingEnrollments(false);
      }
    }

    loadEnrollments();
  }, []);

  const lastActiveEnrollment = enrollments[0] ?? null;
  const lastActiveCourse = lastActiveEnrollment
    ? {
        title: lastActiveEnrollment.course.title,
        slug: lastActiveEnrollment.course.slug,
        currentLesson:
          lastActiveEnrollment.next_lesson?.title ||
          "Continue where you left off",
        progress: lastActiveEnrollment.progress,
        lessonId: lastActiveEnrollment.next_lesson?.id ?? null,
      }
    : null;

  const activeCourses = enrollments.map((enrollment) => ({
    id: enrollment.course.slug,
    title: enrollment.course.title,
    instructor: enrollment.course.teacher ?? "Unknown Instructor",
    progress: enrollment.progress,
    completedLessons: enrollment.completed_lessons,
    totalLessons: enrollment.total_lessons,
  }));

  const purchasedProducts = [
    {
      id: "prod_1",
      title: "Next.js SaaS Boilerplate Template",
      type: "Full Website Codebase",
      repoUrl: "https://github.com/your-org/saas-boilerplate",
      downloadUrl: "#",
    },
    {
      id: "prod_2",
      title: "Agency Portfolio & CMS Template",
      type: "Framer / Webflow Site",
      remixUrl: "https://framer.com/remix/sample",
    },
  ];

  const upcomingDeadlines = [
    {
      id: "dl_1",
      title: "Final Capstone Submission",
      course: "Fullstack Web Dev",
      dueDate: "Tomorrow, 11:59 PM",
      type: "Assignment",
    },
    {
      id: "dl_2",
      title: "Live Q&A & Code Review",
      course: "General Community",
      dueDate: "Aug 12, 2026",
      type: "Live Event",
    },
  ];

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Dynamic Breadcrumbs */}
      <div>
        <DynamicBreadcrumb />
      </div>

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user?.first_name || user?.username || "Student"}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your learning, manage web products, and access student productivity tools.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href="/students/courses">
              <BookOpen className="w-4 h-4 mr-2" /> Explore Courses
            </Link>
          </Button>
          <Button asChild>
            <Link href="/tools">
              <Wrench className="w-4 h-4 mr-2" /> Open Student Tools
            </Link>
          </Button>
        </div>
      </div>

      {/* Hero CTA: Resume Learning */}
      {loadingEnrollments ? (
        <Card className="border-primary/20 bg-muted/5">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <h2 className="text-xl font-bold">Loading your enrolled courses...</h2>
                <p className="text-sm text-muted-foreground">
                  We are fetching your progress so you can jump back into learning.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : enrollmentError ? (
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <h2 className="text-xl font-bold">Unable to load courses</h2>
                <p className="text-sm text-destructive-foreground">
                  {enrollmentError} Try refreshing or visit Explore Courses to enroll.
                </p>
              </div>
              <Button asChild variant="outline" size="lg" className="gap-2 shadow-sm">
                <Link href="/explore">Explore Courses</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : lastActiveCourse ? (
        <Card className="border-primary/20 bg-linear-to-r from-primary/10 via-primary/5 to-background">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant="destructive" className="gap-1">
                    <PlayCircle className="w-3.5 h-3.5" /> Continue Learning
                  </Badge>
                  <span className="text-xs text-muted-foreground">• Last Active Module</span>
                </div>
                <h2 className="text-xl font-bold">{lastActiveCourse.title}</h2>
                <p className="text-sm text-muted-foreground">{lastActiveCourse.currentLesson}</p>

                <div className="pt-2 space-y-1.5 max-w-md">
                  <div className="flex justify-between text-xs font-medium">
                    <span>Course Progress</span>
                    <span>{lastActiveCourse.progress}% Completed</span>
                  </div>
                  <Progress value={lastActiveCourse.progress} className="h-2" />
                </div>
              </div>

              <Button asChild size="lg" className="gap-2 shadow-sm">
                <Link
                  href={
                    lastActiveCourse.lessonId !== null
                      ? `/students/learn/${lastActiveCourse.slug}/${lastActiveCourse.lessonId}`
                      : `/students/courses/${lastActiveCourse.slug}`
                  }
                >
                  Resume Lesson <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2 flex-1">
                <h2 className="text-xl font-bold">You don’t have any active enrollments yet.</h2>
                <p className="text-sm text-muted-foreground">
                  Browse courses, enroll in a learning path, and return here to continue.
                </p>
              </div>
              <Button asChild size="lg" className="gap-2 shadow-sm">
                <Link href="/explore">Explore Courses</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Global Student Metrics Component */}
      <StudentStats enrollments={enrollments} />

      {/* Balanced 12-Column Grid Layout */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* LEFT COLUMN: Core Learning & Purchases (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Enrolled Courses */}
<Card>
  <CardHeader className="flex flex-row items-center justify-between pb-3">
    <div>
      <CardTitle className="text-lg font-bold">Enrolled Courses</CardTitle>
      <CardDescription>Your active learning paths and completion rates</CardDescription>
    </div>
    <Button asChild variant="ghost" size="sm" className="gap-1 text-xs">
      <Link href="/students/enrolled-courses">
        View All <ArrowRight className="w-3 h-3" />
      </Link>
    </Button>
  </CardHeader>
  <CardContent className="space-y-4">
    {activeCourses.length > 0 ? (
      activeCourses.map((course) => (
        <div key={course.id} className="p-4 border rounded-lg bg-card hover:border-primary/40 transition-colors space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-sm">{course.title}</h3>
              <p className="text-xs text-muted-foreground">Instructor: {course.instructor}</p>
            </div>
            <Badge variant="outline" className="text-xs">
              {course.completedLessons}/{course.totalLessons} Lessons
            </Badge>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Completion</span>
              <span>{course.progress}%</span>
            </div>
            <Progress value={course.progress} className="h-1.5" />
          </div>
        </div>
      ))
    ) : (
      <div className="flex flex-col items-center justify-center text-center py-8 px-4 border border-dashed rounded-lg bg-muted/30 space-y-3">
        <div className="p-3 bg-muted rounded-full text-muted-foreground">
          <BookOpen className="w-6 h-6" />
        </div>
        <div className="space-y-1 max-w-sm">
          <h4 className="text-sm font-semibold">No Enrolled Courses</h4>
          <p className="text-xs text-muted-foreground">
            You haven’t enrolled in any courses yet. Browse our catalog to start learning.
          </p>
        </div>
        <Button asChild size="sm" variant="outline" className="mt-2 text-xs">
          <Link href="/students/courses">Explore Courses</Link>
        </Button>
      </div>
    )}
  </CardContent>
</Card>

          {/* Purchased Website Templates & Digital Products */}
          {/* <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-lg font-bold">Purchased Web Products</CardTitle>
                <CardDescription>Source code, GitHub access, and web templates</CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm" className="gap-1 text-xs">
                <Link href="/products">
                  All Downloads <ArrowRight className="w-3 h-3" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {purchasedProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg bg-muted/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-md text-primary">
                      <Code2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{product.title}</h4>
                      <p className="text-xs text-muted-foreground">{product.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {product.repoUrl && (
                      <Button asChild variant="outline" size="sm" className="h-8 text-xs gap-1">
                        <a href={product.repoUrl} target="_blank" rel="noreferrer">
                          <ExternalLink className="w-3 h-3" /> GitHub Repo
                        </a>
                      </Button>
                    )}
                    {product.downloadUrl && (
                      <Button variant="secondary" size="sm" className="h-8 text-xs gap-1">
                        <Download className="w-3 h-3" /> ZIP File
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card> */}

          {/* Analytics Chart Component */}
          <StudentCourseProgressChart />
        </div>

        {/* RIGHT COLUMN: Productivity, Utilities, & Calendar (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Launch Student Tools */}
          {/* <Card className="border-primary/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" /> Student Utilities
              </CardTitle>
              <CardDescription>Instant access to productivity & document tools</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <Button asChild variant="outline" className="h-20 flex flex-col items-center justify-center gap-1.5 text-xs">
                <Link href="/tools/pdf-to-word">
                  <FileText className="w-5 h-5 text-blue-500" />
                  <span>PDF to Word</span>
                </Link>
              </Button>

              <Button asChild variant="outline" className="h-20 flex flex-col items-center justify-center gap-1.5 text-xs">
                <Link href="/tools/word-to-pdf">
                  <FileText className="w-5 h-5 text-red-500" />
                  <span>Word to PDF</span>
                </Link>
              </Button>

              <Button asChild variant="outline" className="h-20 flex flex-col items-center justify-center gap-1.5 text-xs col-span-2">
                <Link href="/tools/humanizer">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span>AI Content Humanizer & Converter</span>
                </Link>
              </Button>
            </CardContent>
          </Card> */}

          {/* Upcoming Deadlines & Live Schedule */}
          {/* <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-primary" /> Upcoming Deadlines
              </CardTitle>
              <CardDescription>Assignments, lessons, & live reviews</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingDeadlines.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg text-xs">
                  <div className="space-y-0.5">
                    <div className="font-semibold text-sm">{item.title}</div>
                    <div className="text-muted-foreground">{item.course} • {item.dueDate}</div>
                  </div>
                  <Badge variant="secondary" className="text-[10px]">
                    {item.type}
                  </Badge>
                </div>
              ))}
              <Button asChild variant="ghost" size="sm" className="w-full text-xs">
                <Link href="/calendar">View Full Calendar</Link>
              </Button>
            </CardContent>
          </Card> */}

          {/* Embedded Student Todo List */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-primary" /> Tasks & To-Do List
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TodoList />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}