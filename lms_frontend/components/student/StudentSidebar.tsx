"use client";

import Link from "next/link";
import Image from "next/image";
import { LucideIcon } from "lucide-react";
import {
  Award,
  BookOpen,
  ClipboardList,
  LayoutDashboard,
  Settings,
  ChevronUp,
  User2,
  ChevronRight,
  Star,
  Grid,
  Compass,
  GraduationCap,
  LogOut,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { TooltipProvider } from "@/components/ui/tooltip";

// 1. Explicit TypeScript Interfaces
interface SubNavItem {
  title: string;
  url: string;
  badge?: string;
}

interface NavItem {
  title: string;
  url?: string; // Optional because collapsible parent items don't have a url
  icon: LucideIcon;
  isCollapsible?: boolean;
  defaultOpen?: boolean;
  items?: SubNavItem[];
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

// 2. Strongly Typed Navigation Configuration
const studentNavGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        url: "/student/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Explore Courses",
        url: "/courses",
        icon: Compass,
      },
      {
        title: "Categories",
        url: "/categories",
        icon: Grid,
      },
    ],
  },
  {
    label: "My Academics",
    items: [
      {
        title: "My Courses",
        icon: BookOpen,
        isCollapsible: true,
        defaultOpen: true,
        items: [
          {
            title: "Enrolled Courses",
            url: "/student/courses",
            badge: "4",
          },
          {
            title: "Completed Courses",
            url: "/student/courses/completed",
          },
        ],
      },
      {
        title: "Quizzes & Scores",
        url: "/student/quizzes",
        icon: ClipboardList,
      },
      {
        title: "My Certificates",
        url: "/student/certificates",
        icon: Award,
      },
      {
        title: "My Reviews",
        url: "/student/reviews",
        icon: Star,
      },
    ],
  },
  {
    label: "Account",
    items: [
      {
        title: "Profile & Settings",
        url: "/student/settings",
        icon: Settings,
      },
    ],
  },
];

export default function StudentSidebar() {
  return (
    <TooltipProvider>
      <Sidebar collapsible="icon">
        {/* Brand Header */}
        <SidebarHeader className="py-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link href="/student/dashboard">
                  <div className="flex items-center justify-center  bg-primary text-primary-foreground p-1.5">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-bold">Janaki Soft</span>
                    <span className="truncate text-xs text-muted-foreground">
                      Student Portal
                    </span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarSeparator />

        {/* Navigation Content */}
        <SidebarContent>
          {studentNavGroups.map((group) => (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => {
                    // Render Collapsible Group
                    if (item.isCollapsible && item.items) {
                      return (
                        <Collapsible
                          key={item.title}
                          defaultOpen={item.defaultOpen}
                          className="group/collapsible"
                        >
                          <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                              <SidebarMenuButton tooltip={item.title}>
                                <item.icon className="h-4 w-4" />
                                <span>{item.title}</span>
                                <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                              </SidebarMenuButton>
                            </CollapsibleTrigger>

                            <CollapsibleContent>
                              <SidebarMenuSub>
                                {item.items.map((subItem) => (
                                  <SidebarMenuSubItem key={subItem.title}>
                                    <SidebarMenuSubButton asChild>
                                      <Link href={subItem.url}>
                                        <span>{subItem.title}</span>
                                      </Link>
                                    </SidebarMenuSubButton>
                                    {subItem.badge && (
                                      <SidebarMenuBadge>
                                        {subItem.badge}
                                      </SidebarMenuBadge>
                                    )}
                                  </SidebarMenuSubItem>
                                ))}
                              </SidebarMenuSub>
                            </CollapsibleContent>
                          </SidebarMenuItem>
                        </Collapsible>
                      );
                    }

                    // Render Standard Single Link Item (with safe href fallback)
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton tooltip={item.title} asChild>
                          <Link href={item.url ?? "#"}>
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>

        {/* Profile Footer */}
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton size="lg">
                    <Image
                      src="/profile.jpg"
                      alt="Student Profile"
                      width={28}
                      height={28}
                      className="rounded-full object-cover"
                    />
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        Hridaya Shrestha
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        Student Account
                      </span>
                    </div>
                    <ChevronUp className="ml-auto h-4 w-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/student/settings">
                      <User2 className="mr-2 h-4 w-4" /> Account Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/student/certificates">
                      <Award className="mr-2 h-4 w-4" /> My Certificates
                    </Link>
                  </DropdownMenuItem>
                  <SidebarSeparator />
                  <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </TooltipProvider>
  );
}