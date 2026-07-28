"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Card } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { ScrollArea } from "./ui/scroll-area";

export default function TodoList() {
  const [date, setDate] = useState<Date>();
  const [open, setOpen] = useState(false);

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Upload React Hooks lesson video",
      completed: true,
    },
    {
      id: 2,
      title: "Review 12 quiz submissions",
      completed: true,
    },
    {
      id: 3,
      title: "Reply to student questions",
      completed: false,
    },
    {
      id: 4,
      title: "Publish Machine Learning course",
      completed: false,
    },
    {
      id: 5,
      title: "Create Quiz for Chapter 4",
      completed: false,
    },
    {
      id: 6,
      title: "Update Django REST course description",
      completed: false,
    },
    {
      id: 7,
      title: "Issue certificates to completed students",
      completed: false,
    },
    {
      id: 8,
      title: "Review latest course feedback",
      completed: false,
    },
  ]);

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
            }
          : task
      )
    );
  };

  return (
    <div>
      <h1 className="mb-6 text-lg font-medium">Today's Tasks</h1>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : "Select Date"}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(value) => {
              setDate(value);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>

      <ScrollArea className="mt-4 h-[400px]">
        <div className="space-y-3">
          {tasks.map((task) => (
            <Card
              key={task.id}
              className="transition-colors hover:bg-muted/40"
            >
              <div className="flex items-center gap-3 p-4">
                <Checkbox
                  id={`task-${task.id}`}
                  checked={task.completed}
                  onCheckedChange={() => toggleTask(task.id)}
                />

                <label
                  htmlFor={`task-${task.id}`}
                  onClick={() => toggleTask(task.id)}
                  className={`flex-1 cursor-pointer select-none text-sm transition-all duration-200 ${
                    task.completed
                      ? "text-muted-foreground line-through"
                      : "text-foreground"
                  }`}
                >
                  {task.title}
                </label>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}