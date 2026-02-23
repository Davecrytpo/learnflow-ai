import { BookOpen, LayoutDashboard, PlusCircle, ClipboardCheck, BarChart3, User, CalendarCheck, Megaphone, Users, ListChecks, UploadCloud, Link, FileCheck2, HelpCircle, MessagesSquare, FileSignature, Video, ClipboardList, Layers, LibraryBig, ClipboardSignature, ShieldCheck, FileSearch, Briefcase, UserRoundCheck, Clock, Activity, ScrollText } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader } from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/instructor", icon: LayoutDashboard },
  { title: "My Courses", url: "/instructor/courses", icon: BookOpen },
  { title: "Create Course", url: "/instructor/courses/new", icon: PlusCircle },
  { title: "Grading", url: "/instructor/grading", icon: ClipboardCheck },
  { title: "Attendance", url: "/instructor/attendance", icon: CalendarCheck },
  { title: "Announcements", url: "/instructor/announcements", icon: Megaphone },
  { title: "Cohorts", url: "/instructor/groups", icon: Users },
  { title: "Analytics", url: "/instructor/analytics", icon: BarChart3 },
  { title: "Resources", url: "/instructor/resources", icon: Link },
  { title: "Assignments", url: "/instructor/assignments", icon: FileCheck2 },
  { title: "Quizzes", url: "/instructor/quizzes", icon: HelpCircle },
  { title: "Discussions", url: "/instructor/discussions", icon: MessagesSquare },
  { title: "Messages", url: "/instructor/messages", icon: MessagesSquare },
  { title: "Rubrics", url: "/instructor/rubrics", icon: FileSignature },
  { title: "Live Sessions", url: "/instructor/live-sessions", icon: Video },
  { title: "Surveys", url: "/instructor/surveys", icon: ClipboardList },
  { title: "Competencies", url: "/instructor/competencies", icon: Layers },
  { title: "Content Library", url: "/instructor/content-library", icon: LibraryBig },
  { title: "Assessments", url: "/instructor/assessments", icon: ClipboardSignature },
  { title: "Proctoring", url: "/instructor/proctoring", icon: ShieldCheck },
  { title: "Integrity", url: "/instructor/integrity", icon: FileSearch },
  { title: "Portfolio Reviews", url: "/instructor/portfolio-reviews", icon: Briefcase },
  { title: "Coaching", url: "/instructor/coaching", icon: UserRoundCheck },
  { title: "Office Hours", url: "/instructor/office-hours", icon: Clock },
  { title: "Cohort Heatmap", url: "/instructor/cohort-heatmap", icon: Activity },
  { title: "Outcome Analytics", url: "/instructor/outcome-analytics", icon: BarChart3 },
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
        <span className="font-display text-sm font-bold text-sidebar-foreground">Learnflow AI</span>
      </div>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">Instructor</SidebarGroupLabel>
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
