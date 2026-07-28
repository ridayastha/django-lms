"use client";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

const chartConfig = {
  enrolled: {
    label: "Enrollments",
    color: "var(--chart-1)",
  },
  completed: {
    label: "Completed",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const chartData = [
  {
    month: "January",
    enrolled: 42,
    completed: 18,
  },
  {
    month: "February",
    enrolled: 58,
    completed: 27,
  },
  {
    month: "March",
    enrolled: 73,
    completed: 39,
  },
  {
    month: "April",
    enrolled: 64,
    completed: 45,
  },
  {
    month: "May",
    enrolled: 81,
    completed: 57,
  },
  {
    month: "June",
    enrolled: 95,
    completed: 69,
  },
];

const AppBarChart = () => {
  return (
    <div>
      <h1 className="text-lg font-medium mb-2">
        Monthly Student Activity
      </h1>

      <p className="text-sm text-muted-foreground mb-6">
        Student activity over the last six months.
      </p>

      <ChartContainer
        config={chartConfig}
        className="min-h-[200px] w-full"
      >
        <BarChart
          accessibilityLayer
          data={chartData}
        >
          <CartesianGrid vertical={false} />

          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />

          <YAxis
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />

          <ChartTooltip
            content={<ChartTooltipContent />}
          />

          <ChartLegend
            content={<ChartLegendContent />}
          />

          <Bar
            dataKey="enrolled"
            fill="var(--color-enrolled)"
            radius={4}
          />

          <Bar
            dataKey="completed"
            fill="var(--color-completed)"
            radius={4}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default AppBarChart;