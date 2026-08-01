import { notFound } from "next/navigation";
import Link from "next/link";

import { getCourseBySlugOrId } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  ArrowLeft,
  Clock,
  PlayCircle,
} from "lucide-react";

interface PageProps {
  params: Promise<{
    slug: string;
    lessonId: string;
  }>;
}

function getYouTubeEmbedUrl(url: string) {
  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    if (parsed.hostname === "youtu.be") {
      const id = parsed.pathname.slice(1);
      return id
        ? `https://www.youtube.com/embed/${id}`
        : null;
    }

    return null;
  } catch {
    return null;
  }
}

export default async function LessonPreviewPage({
  params,
}: PageProps) {
  const { slug, lessonId } = await params;

  const course = await getCourseBySlugOrId(slug);

  const lesson = course.chapters
    .flatMap((chapter) => chapter.lessons)
    .find((lesson) => lesson.id === Number(lessonId));

  if (!lesson) {
    notFound();
  }

  // Only preview lessons can be viewed
  if (!lesson.is_preview) {
    notFound();
  }

  const youtubeEmbedUrl = lesson.video_url
    ? getYouTubeEmbedUrl(lesson.video_url)
    : null;

  return (
    <div className="mx-auto max-w-6xl p-8 space-y-8">

      <Button asChild variant="ghost">
        <Link href={`/students/courses/${course.slug}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Course
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <Badge className="w-fit mb-3">
            Free Preview
          </Badge>

          <CardTitle className="text-3xl">
            {lesson.title}
          </CardTitle>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-3">
            <Clock className="h-4 w-4" />
            {lesson.duration_minutes} minutes
          </div>
        </CardHeader>

        <CardContent className="space-y-6">

          {/* Video */}

          {youtubeEmbedUrl ? (
            <div className="aspect-video w-full rounded-lg overflow-hidden border">
              <iframe
                src={youtubeEmbedUrl}
                title={lesson.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ) : lesson.video_url ? (
            <video
              controls
              className="w-full rounded-lg border aspect-video object-cover"
            >
              <source src={lesson.video_url} />
            </video>
          ) : (
            <div className="aspect-video rounded-lg border bg-muted flex items-center justify-center">
              <div className="text-center">
                <PlayCircle className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">
                  No preview video available.
                </p>
              </div>
            </div>
          )}

          {/* Lesson Content */}

          {lesson.content && (
            <Card>
              <CardHeader>
                <CardTitle>Lesson Notes</CardTitle>
              </CardHeader>

              <CardContent>
                <p className="whitespace-pre-wrap leading-7">
                  {lesson.content}
                </p>
              </CardContent>
            </Card>
          )}

        </CardContent>
      </Card>

    </div>
  );
}