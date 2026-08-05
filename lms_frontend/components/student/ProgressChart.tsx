"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const progressData = [
  { course: "Math 101", progress: 85, target: 100 },
  { course: "Physics", progress: 62, target: 100 },
  { course: "CS 50", progress: 94, target: 100 },
  { course: "English", progress: 45, target: 100 },
  { course: "History", progress: 78, target: 100 },
];

export default function ProgressChart() {
  return (
    <Card className="col-span-4 border rounded-xl">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Course Completion Rate</CardTitle>
        <CardDescription>Track your active course progress percentage</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="w-full">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={progressData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} vertical={false} />
              <XAxis dataKey="course" tickLine={false} axisLine={false} className="text-xs font-medium" />
              <YAxis unit="%" domain={[0, 100]} tickLine={false} axisLine={false} className="text-xs font-medium" />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm text-xs">
                        <p className="font-semibold">{payload[0].payload.course}</p>
                        <p className="text-primary">{`Progress: ${payload[0].value}%`}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="progress"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#progressGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}