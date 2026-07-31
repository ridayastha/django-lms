import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCourseBySlugOrId } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PlayCircle, Clock, BookOpen, User, SignalHigh, CheckCircle2, ArrowLeft } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let course;
  try {
    course = await getCourseBySlugOrId(slug);
  } catch {
    notFound();
  }

  if (!course) {
    notFound();
  }

  // Resolve category title
  const categoryTitle =
    typeof course.category === 'object'
      ? course.category?.title
      : course.category || 'General';

  // Resolve teacher full name
  const teacherName = course.teacher?.user
    ? `${course.teacher.user.first_name ?? ''} ${course.teacher.user.last_name ?? ''}`.trim()
    : 'Course Instructor';

  // Calculate total lessons
  const totalLessons =
    course.chapters?.reduce((acc, ch) => acc + (ch.lessons?.length || 0), 0) || 0;

  return (
    <div className="mx-auto w-full max-w-7xl px-8 py-8 space-y-8">
      {/* Back to Explore Courses Navigation */}
      <div>
        <Button variant="ghost" size="sm" asChild className="gap-2 text-muted-foreground hover:text-foreground">
          <Link href="/students/courses">
            <ArrowLeft className="w-4 h-4" />
            Back to Explore Courses
          </Link>
        </Button>
      </div>

      {/* Hero Banner / Course Header Card */}
      <Card className="bg-card text-card-foreground border-border shadow-md overflow-hidden">
        <CardHeader className="p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="uppercase">
              {categoryTitle}
            </Badge>
            <Badge variant="outline" className="capitalize">
              <SignalHigh className="w-3 h-3 mr-1" />
              {course.level || 'All Levels'}
            </Badge>
          </div>

          <CardTitle className="text-2xl md:text-4xl font-extrabold tracking-tight">
            {course.title}
          </CardTitle>

          <CardDescription className="text-muted-foreground text-sm md:text-base max-w-3xl leading-relaxed">
            {course.description || 'No description available for this course.'}
          </CardDescription>

          <Separator className="my-4" />

          {/* Instructor & Meta Details */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-2">
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                <span>
                  Instructor: <strong className="text-foreground">{teacherName}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                <span>{totalLessons} Lessons</span>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
              <span className="text-2xl font-bold text-foreground">
                {Number(course.price) > 0 ? `$${course.price}` : 'Free'}
              </span>
              <Button size="lg" className="font-semibold shadow-sm">
                Enroll Now
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Chapters & Lessons Curriculum */}
      <Card className="bg-card text-card-foreground border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl font-bold flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Course Curriculum
          </CardTitle>
          <CardDescription>
            {course.chapters?.length || 0} Chapters • {totalLessons} Lessons
          </CardDescription>
        </CardHeader>

        <CardContent>
          {course.chapters && course.chapters.length > 0 ? (
            <Accordion
              type="multiple"
              defaultValue={course.chapters.map((ch) => `chapter-${ch.id}`)}
              className="w-full"
            >
              {course.chapters.map((chapter) => (
                <AccordionItem key={chapter.id} value={`chapter-${chapter.id}`}>
                  <AccordionTrigger className="hover:no-underline font-semibold text-base py-4">
                    <div className="flex items-center gap-3 text-left">
                      <span className="text-sm text-muted-foreground font-normal">
                        Chapter {chapter.order}
                      </span>
                      <span>{chapter.title}</span>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="pt-1 pb-4">
                    <div className="divide-y rounded-md border border-border bg-muted/30">
                      {chapter.lessons && chapter.lessons.length > 0 ? (
                        chapter.lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            className="p-3.5 flex items-center justify-between hover:bg-muted/60 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <PlayCircle className="w-4 h-4 text-muted-foreground" />
                              <span className="font-medium text-sm text-foreground">
                                {lesson.order}. {lesson.title}
                              </span>
                              {lesson.is_preview && (
                                <Badge
                                  variant="secondary"
                                  className="text-[10px] font-semibold"
                                >
                                  <CheckCircle2 className="w-2.5 h-2.5 mr-1 text-primary" /> Free Preview
                                </Badge>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{lesson.duration_minutes ?? 0} mins</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="p-3 text-sm text-muted-foreground italic">
                          No lessons in this chapter yet.
                        </p>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <p className="text-muted-foreground text-sm py-4">
              No curriculum has been uploaded for this course yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}