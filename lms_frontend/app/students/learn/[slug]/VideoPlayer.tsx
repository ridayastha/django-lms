import { PlayCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Lesson } from "@/types/lms";

interface VideoPlayerProps {
  lesson: Lesson;
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

export default function VideoPlayer({
  lesson,
}: VideoPlayerProps) {
  const youtubeEmbedUrl = lesson.video_url
    ? getYouTubeEmbedUrl(lesson.video_url)
    : null;

  return (
    <Card className="rounded-none border-x-0 border-t-0 shadow-none">
      <CardContent className="p-0">

        {youtubeEmbedUrl ? (
          <div className="aspect-video bg-black">
            <iframe
              src={youtubeEmbedUrl}
              title={lesson.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        ) : lesson.video_url ? (
          <video
            controls
            className="aspect-video w-full bg-black"
          >
            <source src={lesson.video_url} />
            Your browser does not support HTML5 video.
          </video>
        ) : (
          <div className="aspect-video flex flex-col items-center justify-center bg-muted">
            <PlayCircle className="h-16 w-16 text-muted-foreground mb-4" />

            <p className="text-muted-foreground text-lg">
              No video uploaded
            </p>
          </div>
        )}

      </CardContent>
    </Card>
  );
}