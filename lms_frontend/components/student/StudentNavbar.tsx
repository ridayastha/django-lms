"use client";

import { Bell, Search } from "lucide-react";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function StudentNavbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center gap-4">
        <Search className="h-5 w-5 text-muted-foreground" />

        <Input
          placeholder="Search courses..."
          className="w-72"
        />
      </div>

      <div className="flex items-center gap-4">
        <Bell className="h-5 w-5 cursor-pointer" />

        <Avatar>
          <AvatarImage src="/profile.jpg" />
          <AvatarFallback>ST</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}