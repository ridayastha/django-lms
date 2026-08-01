"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Lesson } from "@/types/lms";

interface LessonNavigationProps {
  slug: string;
  previousLesson: Lesson | null;
  nextLesson: Lesson | null;
  onMarkComplete?: () => void;
}

export default function LessonNavigation({
  slug,
  previousLesson,
  nextLesson,
  onMarkComplete,
}: LessonNavigationProps) {
  return (
    <div className="border-t bg-background px-6 py-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        {previousLesson ? (
          <Button variant="outline" asChild>
            <Link href={`/students/learn/${slug}/${previousLesson.id}`}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              {previousLesson.title}
            </Link>
          </Button>
        ) : (
          <Button variant="outline" disabled>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous Lesson
          </Button>
        )}
      </div>

      <Button
        onClick={onMarkComplete}
        size="lg"
        className="gap-2"
      >
        <CheckCircle2 className="h-5 w-5" />
        Mark Complete
      </Button>

      {/* once authenticated is added
      <Button
  onClick={markLessonComplete}
  disabled={completed}
>
  {completed ? (
    <>
      <CheckCircle2 className="mr-2 h-4 w-4" />
      Completed
    </>
  ) : (
    <>
      <CheckCircle2 className="mr-2 h-4 w-4" />
      Mark as Complete
    </>
  )}
</Button> */}

      <div>
        {nextLesson ? (
          <Button variant="outline" asChild>
            <Link href={`/students/learn/${slug}/${nextLesson.id}`}>
              {nextLesson.title}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <Button variant="outline" disabled>
            Next Lesson
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}