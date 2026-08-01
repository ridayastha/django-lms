"use client";

import Link from "next/link";

import {
  Clock,
  FileText,
  Paperclip,
  BookOpen,
  CheckCircle2,
  Circle,
  PlayCircle,
} from "lucide-react";

import { Lesson, CourseDetail } from "@/types/lms";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface LessonContentProps {
  lesson: Lesson;
  course: CourseDetail;
  completedLessonIds?: number[];
}

export default function LessonContent({
  lesson,
  course,
  completedLessonIds = [],
}: LessonContentProps) {
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
    <div className="space-y-6 p-6">

      {/* Lesson Information */}

      <Card>

        <CardHeader>

          <div className="flex flex-wrap items-start justify-between gap-4">

            <div>

              <CardTitle className="text-3xl">
                {lesson.title}
              </CardTitle>

              <CardDescription className="mt-2 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {lesson.duration_minutes} minutes
              </CardDescription>

            </div>

            {lesson.is_preview && (
              <Badge>
                Free Preview
              </Badge>
            )}

          </div>

        </CardHeader>

        <CardContent>

          {lesson.content ? (
            <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">
              {lesson.content}
            </div>
          ) : (
            <p className="text-muted-foreground">
              No lesson notes have been added yet.
            </p>
          )}

        </CardContent>

      </Card>

      {/* Course Progress */}

      <Card>

        <CardHeader>

          <CardTitle>
            Course Progress
          </CardTitle>

          <CardDescription>
            Your learning progress for this course.
          </CardDescription>

        </CardHeader>

        <CardContent className="space-y-4">

          <Progress value={progress} />

          <div className="flex items-center justify-between text-sm">

            <span className="text-muted-foreground">
              {completedLessons} of {totalLessons} lessons completed
            </span>

            <Badge variant="secondary">
              {Math.round(progress)}%
            </Badge>

          </div>

        </CardContent>

      </Card>

      {/* Course Curriculum */}

      <Card>

        <CardHeader>

          <CardTitle>
            Course Curriculum
          </CardTitle>

          <CardDescription>
            {course.chapters.length} Chapters • {totalLessons} Lessons
          </CardDescription>

        </CardHeader>

        <CardContent>

          <Accordion
            type="multiple"
            defaultValue={
              course.chapters
                .filter((chapter) =>
                  chapter.lessons.some(
                    (l) => l.id === lesson.id
                  )
                )
                .map((chapter) => `chapter-${chapter.id}`)
            }
          >

            {course.chapters.map((chapter) => (

              <AccordionItem
                key={chapter.id}
                value={`chapter-${chapter.id}`}
              >

                <AccordionTrigger>

                  <div className="flex items-center gap-2">

                    <BookOpen className="h-4 w-4" />

                    <span className="font-medium">
                      {chapter.title}
                    </span>

                    <Badge variant="secondary">
                      {chapter.lessons.length}
                    </Badge>

                  </div>

                </AccordionTrigger>

                <AccordionContent>

                  <div className="space-y-1">

                    {chapter.lessons.map((currentLesson) => {

                      const completed =
                        completedLessonIds.includes(
                          currentLesson.id
                        );

                      const current =
                        currentLesson.id === lesson.id;

                      return (

                        <Link
                          key={currentLesson.id}
                          href={`/students/learn/${course.slug}/${currentLesson.id}`}
                          className={`flex items-center gap-3 rounded-md px-3 py-2 transition-colors ${
                            current
                              ? "bg-muted font-medium"
                              : "hover:bg-muted"
                          }`}
                        >

                          {completed ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          ) : (
                            <Circle className="h-4 w-4 text-muted-foreground" />
                          )}

                          <span className="flex-1 truncate">
                            {currentLesson.title}
                          </span>

                          {currentLesson.is_preview && (
                            <PlayCircle className="h-4 w-4 text-primary" />
                          )}

                          {current && (
                            <Badge>
                              Current
                            </Badge>
                          )}

                        </Link>

                      );
                    })}

                  </div>

                </AccordionContent>

              </AccordionItem>

            ))}

          </Accordion>

        </CardContent>

      </Card>

      {/* Attachments */}

      <Card>

        <CardHeader>

          <CardTitle className="flex items-center gap-2">
            <Paperclip className="h-5 w-5" />
            Lesson Resources
          </CardTitle>

          <CardDescription>
            Download lesson files and supporting materials.
          </CardDescription>

        </CardHeader>

        <CardContent>

          {lesson.attachments?.length ? (

            <div className="space-y-3">

              {lesson.attachments.map((attachment) => (

                <a
                  key={attachment.id}
                  href={attachment.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted transition-colors"
                >

                  <div className="flex items-center gap-3">

                    <FileText className="h-5 w-5 text-primary" />

                    <div>

                      <p className="font-medium">
                        {attachment.title}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        Resource File
                      </p>

                    </div>

                  </div>

                  <Badge variant="outline">
                    Download
                  </Badge>

                </a>

              ))}

            </div>

          ) : (

            <p className="text-muted-foreground">
              No resources have been uploaded for this lesson.
            </p>

          )}

        </CardContent>

      </Card>

    </div>
  );
}