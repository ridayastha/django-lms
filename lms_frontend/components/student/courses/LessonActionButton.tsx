"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import api from "@/lib/axios";

import { Button } from "@/components/ui/button";

import {
  Lock,
  PlayCircle,
} from "lucide-react";

interface Props {
  slug: string;
  lessonId: number;
  isPreview: boolean;
}

export default function LessonActionButton({
  slug,
  lessonId,
  isPreview,
}: Props) {
  const [checking, setChecking] = useState(true);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const response = await api.get(
          `/courses/${slug}/enrollment/`
        );

        setEnrolled(response.data.enrolled);
      } catch {
        setEnrolled(false);
      } finally {
        setChecking(false);
      }
    }

    load();
  }, [slug]);

  if (checking) {
    return (
      <Button
        size="sm"
        variant="secondary"
        disabled
      >
        Checking...
      </Button>
    );
  }

  // Student enrolled -> always Start Lesson
  if (enrolled) {
  return (
    <Link
      href={`/students/learn/${slug}/${lessonId}`}
      className="inline-flex items-center gap-2 text-primary hover:underline text-sm font-medium"
    >
      <PlayCircle className="h-4 w-4" />
      Start Lesson
    </Link>
  );
}

  // Not enrolled but preview lesson
  if (isPreview) {
    return (
      <Button
        asChild
        size="sm"
        variant="outline"
      >
        <Link
          href={`/students/courses/${slug}/preview/${lessonId}`}
        >
          <PlayCircle className="mr-2 h-4 w-4" />
          Preview
        </Link>
      </Button>
    );
  }

  // Locked lesson
  return (
    <Button
      size="sm"
      variant="secondary"
      disabled
    >
      <Lock className="mr-2 h-4 w-4" />
      Locked
    </Button>
  );
}