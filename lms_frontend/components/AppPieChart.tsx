"use client";

import React, { useState, useMemo } from "react";
import { Label, Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";

// ==========================================
// 1. MOCK DATASETS & CONFIGS
// ==========================================

const MOCK_DATASETS = {
  courseLevels: {
    title: "Course Level Breakdown",
    labelKey: "Total Courses",
    dataKey: "count",
    nameKey: "level",
    config: {
      count: { label: "Courses" },
      BEGINNER: { label: "Beginner", color: "var(--chart-1)" },
      INTERMEDIATE: { label: "Intermediate", color: "var(--chart-2)" },
      ADVANCED: { label: "Advanced", color: "var(--chart-3)" },
    } satisfies ChartConfig,
    data: [
      { level: "BEGINNER", count: 24, fill: "var(--color-BEGINNER)" },
      { level: "INTERMEDIATE", count: 16, fill: "var(--color-INTERMEDIATE)" },
      { level: "ADVANCED", count: 8, fill: "var(--color-ADVANCED)" },
    ],
  },
  enrollmentStatus: {
    title: "Enrollment Completion Status",
    labelKey: "Total Students",
    dataKey: "students",
    nameKey: "status",
    config: {
      students: { label: "Students" },
      COMPLETED: { label: "Completed", color: "var(--chart-1)" },
      IN_PROGRESS: { label: "In Progress", color: "var(--chart-2)" },
    } satisfies ChartConfig,
    data: [
      { status: "COMPLETED", students: 142, fill: "var(--color-COMPLETED)" },
      { status: "IN_PROGRESS", students: 310, fill: "var(--color-IN_PROGRESS)" },
    ],
  },
  quizOutcomes: {
    title: "Quiz Attempts Pass vs Fail",
    labelKey: "Total Attempts",
    dataKey: "attempts",
    nameKey: "outcome",
    config: {
      attempts: { label: "Attempts" },
      PASSED: { label: "Passed", color: "var(--chart-1)" },
      FAILED: { label: "Failed", color: "var(--chart-5)" },
    } satisfies ChartConfig,
    data: [
      { outcome: "PASSED", attempts: 480, fill: "var(--color-PASSED)" },
      { outcome: "FAILED", attempts: 95, fill: "var(--color-FAILED)" },
    ],
  },
};

type MetricKey = keyof typeof MOCK_DATASETS;

// ==========================================
// 2. PIE CHART COMPONENT
// ==========================================

export default function AppPieChart() {
  const [activeMetric, setActiveMetric] = useState<MetricKey>("courseLevels");

  const currentDataset = MOCK_DATASETS[activeMetric];

  const totalCount = useMemo(() => {
    return currentDataset.data.reduce(
      (acc, curr) => acc + (curr as any)[currentDataset.dataKey],
      0
    );
  }, [currentDataset]);

  return (
    <div className="flex flex-col justify-between h-full w-full min-h-[320px]">
      {/* Header & Filter Tabs */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold tracking-tight">
            {currentDataset.title}
          </h2>
        </div>

        <div className="flex gap-1 mb-2 p-1 rounded-lg bg-muted text-muted-foreground text-xs font-medium">
          <button
            onClick={() => setActiveMetric("courseLevels")}
            className={`flex-1 py-2 px-2 rounded-md transition-all ${
              activeMetric === "courseLevels"
                ? "bg-background text-foreground shadow-sm font-semibold"
                : "hover:text-foreground"
            }`}
          >
            Levels
          </button>
          <button
            onClick={() => setActiveMetric("enrollmentStatus")}
            className={`flex-1 py-2 px-2 rounded-md transition-all ${
              activeMetric === "enrollmentStatus"
                ? "bg-background text-foreground shadow-sm font-semibold"
                : "hover:text-foreground"
            }`}
          >
            Enrollments
          </button>
          <button
            onClick={() => setActiveMetric("quizOutcomes")}
            className={`flex-1 py-2 px-2 rounded-md transition-all ${
              activeMetric === "quizOutcomes"
                ? "bg-background text-foreground shadow-sm font-semibold"
                : "hover:text-foreground"
            }`}
          >
            Quizzes
          </button>
        </div>
      </div>

      {/* Responsive Chart Container */}
      <div className="flex-1 flex items-center justify-center my-2">
        <ChartContainer
          config={currentDataset.config}
          className="mx-auto aspect-square w-full max-h-[200px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={currentDataset.data}
              dataKey={currentDataset.dataKey}
              nameKey={currentDataset.nameKey}
              innerRadius={52}
              outerRadius={75}
              strokeWidth={3}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {totalCount.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 18}
                          className="fill-muted-foreground text-[10px]"
                        >
                          {currentDataset.labelKey}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </div>

      {/* Legend Footer */}
      <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground pt-2 border-t border-border/50">
        {Object.entries(currentDataset.config)
          .filter(([key]) => key !== currentDataset.dataKey)
          .map(([key, item]) => (
            <div key={key} className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span>{item.label}</span>
            </div>
          ))}
      </div>
    </div>
  );
}