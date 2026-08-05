"use client";

import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Lesson } from "@/types/lms";

interface LessonNavigationProps {
  slug: string;
  currentLessonId: number;

  previousLesson: Lesson | null;
  nextLesson: Lesson | null;

  completed: boolean;
  loading?: boolean;

  onMarkComplete: () => void;
}

export default function LessonNavigation({
  slug,
  previousLesson,
  nextLesson,
  completed,
  loading = false,
  onMarkComplete,
}: LessonNavigationProps) {
  return (
    <div className="border-t bg-background px-6 py-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

      {/* Previous */}
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

      {/* Mark Complete */}
      <Button
        size="lg"
        onClick={onMarkComplete}
        disabled={completed || loading}
        className={
          completed
            ? "bg-green-600 hover:bg-green-600 text-white"
            : ""
        }
      >
        <CheckCircle2 className="mr-2 h-4 w-4" />

        {loading
          ? "Saving..."
          : completed
          ? "Completed"
          : "Mark Complete"}
      </Button>

      {/* Next */}
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