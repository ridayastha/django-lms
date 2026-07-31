"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
      {
        title: "Categories",
        url: "/students/categories", // Added leading slash
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
        defaultOpen: false, // Changed to false so it doesn't stay open when not active
        items: [
          {
            title: "Enrolled Courses",
            url: "/students/enrolled-courses", // Changed from /students/courses to avoid conflict
            badge: "4",
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

  // Helper function to check if a route is active
  const isItemActive = (url?: string) => {
    if (!url) return false;
    if (url === "/students") return pathname === "/students"; // Strict match for root dashboard
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
                                      </Link>
                                    </SidebarMenuSubButton>

                                    {subItem.badge && (
                                      <SidebarMenuBadge>{subItem.badge}</SidebarMenuBadge>
                                    )}
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