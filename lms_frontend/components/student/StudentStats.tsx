import { BookOpen, CheckCircle2, Clock3, Award } from "lucide-react";

const stats = [
  {
    title: "Enrolled Courses",
    value: 8,
    icon: BookOpen,
  },
  {
    title: "Completed",
    value: 3,
    icon: CheckCircle2,
  },
  {
    title: "Hours Learned",
    value: 126,
    icon: Clock3,
  },
  {
    title: "Certificates",
    value: 2,
    icon: Award,
  },
];

export default function StudentStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className="rounded-xl bg-primary-foreground p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {item.title}
              </p>

              <Icon className="h-5 w-5 text-primary" />
            </div>

            <h2 className="mt-4 text-3xl font-bold">
              {item.value}
            </h2>
          </div>
        );
      })}
    </div>
  );
}