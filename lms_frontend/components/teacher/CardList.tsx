import Image from "next/image";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardFooter, CardTitle } from "../ui/card";

const popularCourses = [
  {
    id: 1,
    title: "JavaScript Tutorial",
    category: "Programming",
    image:
      "https://images.pexels.com/photos/3861964/pexels-photo-3861964.jpeg?auto=compress&cs=tinysrgb&w=800",
    enrollments: 4300,
  },
  {
    id: 2,
    title: "Tech Trends 2025",
    category: "Technology",
    image:
      "https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg?auto=compress&cs=tinysrgb&w=800",
    enrollments: 3200,
  },
  {
    id: 3,
    title: "The Future of AI",
    category: "Artificial Intelligence",
    image:
      "https://images.pexels.com/photos/2007647/pexels-photo-2007647.jpeg?auto=compress&cs=tinysrgb&w=800",
    enrollments: 2400,
  },
  {
    id: 4,
    title: "React Hooks Explained",
    category: "Web Development",
    image:
      "https://images.pexels.com/photos/943096/pexels-photo-943096.jpeg?auto=compress&cs=tinysrgb&w=800",
    enrollments: 1500,
  },
  {
    id: 5,
    title: "Image Generation with AI",
    category: "Artificial Intelligence",
    image:
      "https://images.pexels.com/photos/3094799/pexels-photo-3094799.jpeg?auto=compress&cs=tinysrgb&w=800",
    enrollments: 1200,
  },
];

const latestEnrollments = [
  {
    id: 1,
    student: "Emma Wilson",
    course: "React Fundamentals",
    image:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
    enrolledAt: "2 hours ago",
  },
  {
    id: 2,
    student: "Michael Brown",
    course: "Python for Beginners",
    image:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400",
    enrolledAt: "5 hours ago",
  },
  {
    id: 3,
    student: "Sophia Taylor",
    course: "UI/UX Design",
    image:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400",
    enrolledAt: "Yesterday",
  },
  {
    id: 4,
    student: "Daniel Lee",
    course: "Machine Learning",
    image:
      "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400",
    enrolledAt: "Yesterday",
  },
  {
    id: 5,
    student: "Olivia Martin",
    course: "Django REST Framework",
    image:
      "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=400",
    enrolledAt: "2 days ago",
  },
];

interface CardListProps {
  title: "Popular Courses" | "Latest Enrollments";
}

const CardList = ({ title }: CardListProps) => {
  const isPopularCourses = title === "Popular Courses";

  return (
    <div>
      <h1 className="mb-6 text-lg font-medium">{title}</h1>

      <div className="space-y-3">
        {isPopularCourses
          ? popularCourses.map((course) => (
              <Card
                key={course.id}
                className="flex flex-row items-center gap-4 p-4"
              >
                <div className="relative h-14 w-14 overflow-hidden rounded-lg">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>

                <CardContent className="flex-1 p-0">
                  <CardTitle className="text-sm">
                    {course.title}
                  </CardTitle>

                  <Badge variant="secondary" className="mt-2">
                    {course.category}
                  </Badge>
                </CardContent>

                <CardFooter className="p-0 text-xs border-none">
                  {(course.enrollments / 1000).toFixed(1)}K
                </CardFooter>
              </Card>
            ))
          : latestEnrollments.map((student) => (
              <Card
                key={student.id}
                className="flex flex-row items-center gap-4 p-4"
              >
                <div className="relative h-12 w-12 overflow-hidden rounded-full">
                  <Image
                    src={student.image}
                    alt={student.student}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>

                <CardContent className="flex-1 p-0">
                  <CardTitle className="text-sm">
                    {student.student}
                  </CardTitle>

                  <p className="mt-1 mb-1 text-xs text-muted-foreground">
                    Enrolled in{" "}
                    <span className="font-medium text-foreground">
                      {student.course}
                    </span>
                  </p>
                </CardContent>

                <CardFooter className="p-0 text-xs border-none">
                  {student.enrolledAt}
                </CardFooter>
              </Card>
            ))}
      </div>
    </div>
  );
};

export default CardList;