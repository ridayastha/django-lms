"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
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
import api from "@/lib/axios";

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

interface SubNavItem {
  title: string;
  url: string;
  badge?: string;
}

interface NavItem {
  title: string;
  url?: string;
  icon: LucideIcon;
  isCollapsible?: boolean;
  defaultOpen?: boolean;
  items?: SubNavItem[];
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const studentNavGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        url: "/students",
        icon: LayoutDashboard,
      },
      {
        title: "Explore Courses",
        url: "/students/courses",
        icon: Compass,
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
        defaultOpen: false, // Changed to false so it doesn't stay open when not active
        items: [
          {
            title: "Enrolled Courses",
            url: "/students/enrolled-courses",
          },
          {
            title: "Completed Courses",
            url: "/students/courses/completed",
          },
        ],
      },
      {
        title: "Quizzes & Scores",
        url: "/students/quizzes",
        icon: ClipboardList,
      },
      {
        title: "My Certificates",
        url: "/students/certificates",
        icon: Award,
      },
      {
        title: "My Reviews",
        url: "/students/reviews",
        icon: Star,
      },
    ],
  },
  {
    label: "Account",
    items: [
      {
        title: "Profile & Settings",
        url: "/students/settings",
        icon: Settings,
      },
    ],
  },
];

export default function StudentSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [enrolledCount, setEnrolledCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    async function loadEnrollments() {
      try {
        const response = await api.get("/enrollments/");
        const enrollments = Array.isArray(response.data) ? response.data : [];
        setEnrolledCount(enrollments.length);
        setCompletedCount(enrollments.filter((enrollment) => enrollment.is_completed).length);
      } catch (error) {
        console.error("Failed to load enrolled courses count", error);
        setEnrolledCount(0);
        setCompletedCount(0);
      }
    }

    loadEnrollments();
  }, []);

  // Helper function to check if a route is active
  const isItemActive = (url?: string) => {
    if (!url) return false;
    if (url === "/students") return pathname === "/students"; // Strict match for root dashboard

    if (url === "/students/courses") {
      if (pathname === "/students/courses") return true;
      if (pathname === "/students/courses/completed") return false;
      return pathname.startsWith(`${url}/`);
    }

    return pathname === url || pathname.startsWith(`${url}/`);
  };

  return (
    <TooltipProvider>
      <Sidebar collapsible="icon">
        {/* Brand Header */}
        <SidebarHeader className="py-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link href="/students">
                  <div className="flex items-center justify-center bg-primary text-primary-foreground p-1.5">
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
                    // Check if any sub-item strictly matches current pathname
                    const isParentActive =
                      item.items?.some((subItem) => pathname === subItem.url) ?? false;

                    // Collapsible Menu
                    if (item.isCollapsible && item.items) {
                      return (
                        <Collapsible
                          key={item.title}
                          defaultOpen={item.defaultOpen || isParentActive}
                          className="group/collapsible"
                        >
                          <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                              <SidebarMenuButton
                                tooltip={item.title}
                                isActive={isParentActive}
                              >
                                <item.icon className="h-4 w-4" />
                                <span>{item.title}</span>
                                <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                              </SidebarMenuButton>
                            </CollapsibleTrigger>

                            <CollapsibleContent>
                              <SidebarMenuSub>
                                {item.items.map((subItem) => (
                                  <SidebarMenuSubItem key={subItem.title}>
                                    <SidebarMenuSubButton
                                      asChild
                                      isActive={pathname === subItem.url}
                                    >
                                      <Link href={subItem.url}>
                                        <span>{subItem.title}</span>
                                        {subItem.url === "/students/enrolled-courses" && enrolledCount > 0 ? (
                                          <SidebarMenuBadge>
                                            {enrolledCount.toString()}
                                          </SidebarMenuBadge>
                                        ) : subItem.url === "/students/courses/completed" && completedCount > 0 ? (
                                          <SidebarMenuBadge>
                                            {completedCount.toString()}
                                          </SidebarMenuBadge>
                                        ) : subItem.badge ? (
                                          <SidebarMenuBadge>
                                            {subItem.badge}
                                          </SidebarMenuBadge>
                                        ) : null}
                                      </Link>
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                ))}
                              </SidebarMenuSub>
                            </CollapsibleContent>
                          </SidebarMenuItem>
                        </Collapsible>
                      );
                    }

                    // Standard Menu Item
                    const active = isItemActive(item.url);

                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          tooltip={item.title}
                          isActive={active}
                          asChild
                        >
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
                    {user?.profile_picture ? (
  <Image
    src={user.profile_picture}
    alt={user.username}
    width={28}
    height={28}
    className="rounded-full object-cover"
  />
) : (
  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
    {(user?.username ?? "?")[0].toUpperCase()}
  </div>
)}
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user?.first_name || user?.username}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {user?.email}
                      </span>
                    </div>
                    <ChevronUp className="ml-auto h-4 w-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/students/settings">
                      <User2 className="mr-2 h-4 w-4" /> Account Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/students/certificates">
                      <Award className="mr-2 h-4 w-4" /> My Certificates
                    </Link>
                  </DropdownMenuItem>
                  <SidebarSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive cursor-pointer">
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