"use client";

import Image from "next/image";
import Link from "next/link";

import { BookOpen, User, ArrowRight } from "lucide-react";

import { CourseListItem } from "@/types/lms";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CourseCardProps {
  course: CourseListItem;
}

export default function CourseCard({ course }: CourseCardProps) {
  const image =
    course.featured_img || "/placeholders/default-image.svg";

  const price =
    Number(course.price) > 0 ? `$${course.price}` : "Free";

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Image */}
      <div className="relative h-52 w-full">
        <Image
          src={image}
          alt={course.title}
          fill
          loading="eager"
          className="object-cover"
          unoptimized
        />
      </div>

      <CardContent className="space-y-4 pt-5">
        <div className="flex items-center justify-between">
          <Badge variant="secondary">
            {course.category ?? "General"}
          </Badge>

          <Badge>{course.level}</Badge>
        </div>

        <h3 className="text-xl font-semibold line-clamp-2">
          {course.title}
        </h3>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="h-4 w-4" />
          <span>{course.teacher ?? "Unknown Instructor"}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BookOpen className="h-4 w-4" />
          <span>Published Course</span>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between">
        <span className="text-lg font-bold">
          {price}
        </span>

        <Button asChild>
          <Link href={`/students/courses/${course.slug}`}>
            View Course
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}