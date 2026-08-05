import EnrolledCourseCard from "./EnrolledCourseCard";

interface Props {
  enrollments: any[];
}

export default function EnrolledCourseGrid({
  enrollments,
}: Props) {
  if (enrollments.length === 0) {
    return (
      <div className="rounded-xl border p-12 text-center">
        <h3 className="text-xl font-semibold">
          No enrolled courses
        </h3>

        <p className="text-muted-foreground mt-2">
          Explore courses and start learning today.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {enrollments.map((enrollment) => (
        <EnrolledCourseCard
          key={enrollment.id}
          enrollment={enrollment}
        />
      ))}
    </div>
  );
}