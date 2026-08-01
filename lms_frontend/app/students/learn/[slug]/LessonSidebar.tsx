"use client";

import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  Circle,
  Lock,
  PlayCircle,
} from "lucide-react";

import { CourseDetail } from "@/types/lms";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface LessonSidebarProps {
  course: CourseDetail;
  currentLessonId: number;
  completedLessonIds?: number[];
  enrolled?: boolean;
}

export default function LessonSidebar({
  course,
  currentLessonId,
  completedLessonIds = [],
  enrolled = true,
}: LessonSidebarProps) {
  const totalLessons = course.chapters.reduce(
    (total, chapter) => total + chapter.lessons.length,
    0
  );

  const completedLessons = completedLessonIds.length;

  const progress =
    totalLessons === 0
      ? 0
      : (completedLessons / totalLessons) * 100;

  return (
    <Card className="w-80 rounded-none border-y-0 border-l-0 flex flex-col">

      {/* Header */}

      <CardHeader className="sticky top-0 z-10 border-b bg-background space-y-4">

        <div>
          <CardTitle className="line-clamp-2 text-lg">
            {course.title}
          </CardTitle>

          <p className="mt-1 text-sm text-muted-foreground">
            {course.chapters.length} Chapters • {totalLessons} Lessons
          </p>
        </div>

        <div className="space-y-2">

          <Progress value={progress} />

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{completedLessons} completed</span>
            <span>{Math.round(progress)}%</span>
          </div>

        </div>

      </CardHeader>

      {/* Lesson List */}

      <CardContent className="flex-1 p-0">

        <ScrollArea className="h-[calc(100vh-205px)]">

          <Accordion
            type="multiple"
            defaultValue={course.chapters
              .filter((chapter) =>
                chapter.lessons.some(
                  (lesson) => lesson.id === currentLessonId
                )
              )
              .map((chapter) => `chapter-${chapter.id}`)}
          >
            {course.chapters.map((chapter) => {
              const chapterCompleted = chapter.lessons.filter(
                (lesson) =>
                  completedLessonIds.includes(lesson.id)
              ).length;

              return (
                <AccordionItem
                  key={chapter.id}
                  value={`chapter-${chapter.id}`}
                >
                  <AccordionTrigger className="px-4 hover:no-underline">

                    <div className="flex w-full items-center justify-between pr-3">

                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />

                        <span className="font-medium">
                          {chapter.title}
                        </span>
                      </div>

                      <Badge variant="secondary">
                        {chapterCompleted}/{chapter.lessons.length}
                      </Badge>

                    </div>

                  </AccordionTrigger>

                  <AccordionContent>

                    <div className="space-y-1 px-2 pb-2">

                      {chapter.lessons.map((lesson) => {
                        const isCurrent =
                          lesson.id === currentLessonId;

                        const completed =
                          completedLessonIds.includes(
                            lesson.id
                          );

                        const locked =
                          !enrolled && !lesson.is_preview;

                        return (
                          <Link
                            key={lesson.id}
                            href={
                              locked
                                ? "#"
                                : `/students/learn/${course.slug}/${lesson.id}`
                            }
                            className={`flex items-start gap-3 rounded-md border-l-4 px-3 py-3 transition-colors ${
                              isCurrent
                                ? "border-primary bg-muted"
                                : "border-transparent hover:bg-muted/60"
                            }`}
                          >
                            {/* Status */}

                            <div className="mt-0.5 shrink-0">

                              {locked ? (
                                <Lock className="h-4 w-4 text-muted-foreground" />
                              ) : completed ? (
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                              ) : (
                                <Circle className="h-4 w-4 text-muted-foreground" />
                              )}

                            </div>

                            {/* Lesson */}

                            <div className="min-w-0 flex-1">

                              <p className="truncate text-sm font-medium">
                                {lesson.title}
                              </p>

                              <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">

                                <span>
                                  {lesson.duration_minutes} min
                                </span>

                                {lesson.is_preview && (
                                  <Badge
                                    variant="outline"
                                    className="text-[10px]"
                                  >
                                    <PlayCircle className="mr-1 h-3 w-3" />
                                    Preview
                                  </Badge>
                                )}

                              </div>

                            </div>

                          </Link>
                        );
                      })}

                    </div>

                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>

        </ScrollArea>

      </CardContent>

    </Card>
  );
}