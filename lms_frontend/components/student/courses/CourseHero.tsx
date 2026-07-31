"use client";

import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

import { CourseDetail } from "@/types/lms";

interface Props {
  course: CourseDetail;
}

export default function CourseHero({ course }: Props) {
  return (
    <Card className="overflow-hidden">
      <div className="grid md:grid-cols-3">
        <div className="relative h-72">
          <Image
            src={
              course.featured_img ??
              "https://placehold.co/600x400?text=Course"
            }
            alt={course.title}
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        <div className="space-y-5 p-8 md:col-span-2">
          <Badge>{course.category?.title}</Badge>

          <h1 className="text-4xl font-bold">
            {course.title}
          </h1>

          <p className="text-muted-foreground">
            {course.description}
          </p>

          <div className="flex flex-wrap gap-6 text-sm">
            <span>
              Instructor:
              <strong className="ml-2">
                {course.teacher?.user.first_name}{" "}
                {course.teacher?.user.last_name}
              </strong>
            </span>

            <span>
              Level:
              <strong className="ml-2">
                {course.level}
              </strong>
            </span>

            <span>
              Price:
              <strong className="ml-2">
                ${course.price}
              </strong>
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}