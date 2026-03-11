import { 
  LayoutDashboard, BookOpen, Users, 
  MessageSquare, BarChart, Settings, 
  PlusCircle, Calendar, GraduationCap,
  ClipboardCheck, Bell, User, ListChecks,
  FileText, MessageSquareQuote, FileStack,
  Video, Star, BrainCircuit, Activity,
  FileCheck, HeartHandshake, CalendarDays,
  PieChart, ScrollText, ListPlus, UploadCloud,
  ShieldCheck, Briefcase
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader } from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/instructor", icon: LayoutDashboard },
  { title: "My Curriculum", url: "/instructor/courses", icon: BookOpen },
  { title: "New Course", url: "/instructor/courses/new", icon: PlusCircle },
  { title: "Announcements", url: "/instructor/announcements", icon: Bell },
  { title: "Groups", url: "/instructor/groups", icon: Users },
  { title: "Grading Queue", url: "/instructor/grading", icon: ClipboardCheck },
  { title: "Gradebook", url: "/instructor/gradebook", icon: ListPlus },
  { title: "Attendance", url: "/instructor/attendance", icon: CalendarDays },
  { title: "Analytics", url: "/instructor/analytics", icon: BarChart },
  { title: "Resources", url: "/instructor/resources", icon: FileStack },
  { title: "Assignments", url: "/instructor/assignments", icon: FileText },
  { title: "Quizzes", url: "/instructor/quizzes", icon: ListChecks },
  { title: "Discussions", url: "/instructor/discussions", icon: MessageSquare },
  { title: "Messages", url: "/instructor/messages", icon: MessageSquareQuote },
  { title: "Rubrics", url: "/instructor/rubrics", icon: FileCheck },
  { title: "Live Sessions", url: "/instructor/live-sessions", icon: Video },
  { title: "Surveys", url: "/instructor/surveys", icon: PieChart },
  { title: "Competencies", url: "/instructor/competencies", icon: Star },
  { title: "Content Library", url: "/instructor/content-library", icon: FileStack },
  { title: "Assessments", url: "/instructor/assessments", icon: ClipboardCheck },
  { title: "Proctoring", url: "/instructor/proctoring", icon: ShieldCheck },
  { title: "Integrity", url: "/instructor/integrity", icon: ShieldCheck },
  { title: "Portfolio Reviews", url: "/instructor/portfolio-reviews", icon: Briefcase },
  { title: "Coaching", url: "/instructor/coaching", icon: HeartHandshake },
  { title: "Office Hours", url: "/instructor/office-hours", icon: CalendarDays },
  { title: "Cohort Heatmap", url: "/instructor/cohort-heatmap", icon: Activity },
  { title: "Outcome Analytics", url: "/instructor/outcome-analytics", icon: PieChart },
  { title: "Accreditation Evidence", url: "/instructor/accreditation-evidence", icon: ScrollText },
  { title: "Question Bank", url: "/instructor/question-bank", icon: ListChecks },
  { title: "SCORM Import", url: "/instructor/scorm", icon: UploadCloud },
  { title: "Profile", url: "/dashboard/profile", icon: User },
];

const InstructorSidebar = () => (
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
        <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">Faculty Portal</SidebarGroupLabel>
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

export default InstructorSidebar;
