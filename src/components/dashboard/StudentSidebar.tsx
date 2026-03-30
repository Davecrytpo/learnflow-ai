import { Bell, BookOpen, Calendar, LayoutDashboard, User, MessageSquare, Award, Users, Link, ClipboardCheck, FileCheck2, HelpCircle, MessagesSquare, BookmarkCheck, Route, TrendingUp, Trophy, Briefcase, Sparkles, ShieldCheck, ShoppingBag, BriefcaseBusiness, HeartHandshake, Building2, Search, Target, Building, UsersRound } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader } from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/dashboard/student", icon: LayoutDashboard },
  { title: "My Courses", url: "/courses", icon: BookOpen },
  { title: "Assignments", url: "/dashboard/assignments", icon: FileCheck2 },
  { title: "Quizzes", url: "/dashboard/quizzes", icon: HelpCircle },
  { title: "Grades", url: "/dashboard/grades", icon: ClipboardCheck },
  { title: "Progress", url: "/dashboard/progress", icon: TrendingUp },
  { title: "Discussions", url: "/dashboard/discussions", icon: MessagesSquare },
  { title: "Certificates", url: "/dashboard/certificates", icon: Award },
  { title: "Calendar", url: "/dashboard/calendar", icon: Calendar },
  { title: "Profile", url: "/dashboard/profile", icon: User },
];

const StudentSidebar = () => (
  <Sidebar collapsible="icon">
    <SidebarHeader className="border-b border-sidebar-border px-4 py-3">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-brand">
          <svg className="h-4 w-4 text-primary-foreground" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="font-display text-xs font-bold text-sidebar-foreground truncate">Global University Institute</span>
      </div>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">Scholar Portal</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <NavLink to={item.url} end className="gap-2.5 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" activeClassName="bg-primary/10 text-primary font-medium">
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
);

export default StudentSidebar;
