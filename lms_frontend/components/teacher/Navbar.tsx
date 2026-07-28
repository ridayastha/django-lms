"use client"
import {
  CreditCardIcon,
  LogOutIcon,
  Moon, Sun,
  SettingsIcon,
  SquareMenu,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { SidebarTrigger, useSidebar } from "../ui/sidebar";

export default function Navbar() {
  const { theme, setTheme } = useTheme()
  const {toggleSidebar} = useSidebar()

  return (
    <nav className="flex items-center justify-between p-4">
      {/* Left */}
        <SidebarTrigger/>
        {/* <Button variant='outline' onClick={toggleSidebar}>Custom Button</Button> */}

      {/* Right */}
      <div className="flex items-center gap-4">
        <Link href="/">Dashboard</Link>
        {/* Theme Menu */}
         <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarImage
                src="https://github.com/shadcn.png"
                alt="@shadcn"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent sideOffset={10} align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator/>
            <DropdownMenuItem>
              <UserIcon className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>

            <DropdownMenuItem>
              <CreditCardIcon className="mr-2 h-4 w-4" />
              Billing
            </DropdownMenuItem>

            <DropdownMenuItem>
              <SettingsIcon className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem variant="destructive">
              <LogOutIcon className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='outline' size='icon'>
                    <SquareMenu/>
                    <span className="sr-only">Open Menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem>Menu Item 1</DropdownMenuItem>
                <DropdownMenuItem>Menu Item 2</DropdownMenuItem>
                <DropdownMenuItem>Menu Item 3</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu> */}
      </div>
    </nav>
  );
}