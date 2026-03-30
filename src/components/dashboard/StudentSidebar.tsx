import { 
  LayoutDashboard, BookOpen, FileCheck2, 
  HelpCircle, ClipboardCheck, TrendingUp, 
  MessagesSquare, Award, Calendar, User,
  Bell, GraduationCap
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader } from "@/components/ui/sidebar";

const items = [
  { title: "Scholar Overview", url: "/dashboard/student", icon: LayoutDashboard },
  { title: "Active Curriculum", url: "/courses", icon: BookOpen },
  { title: "Learning Plan", url: "/dashboard/learning-plan", icon: TrendingUp },
  { title: "My Assignments", url: "/dashboard/assignments", icon: FileCheck2 },
  { title: "Quiz Center", url: "/dashboard/quizzes", icon: HelpCircle },
  { title: "Academic Grades", url: "/dashboard/grades", icon: ClipboardCheck },
  { title: "Scholar Discourse", url: "/dashboard/discussions", icon: MessagesSquare },
  { title: "Credential Vault", url: "/dashboard/certificates", icon: Award },
  { title: "Academic Calendar", url: "/dashboard/calendar", icon: Calendar },
  { title: "Messages", url: "/dashboard/messages", icon: Bell },
  { title: "Scholar Profile", url: "/dashboard/profile", icon: User },
];

const StudentSidebar = () => (
  <Sidebar collapsible="icon">
    <SidebarHeader className="border-b border-sidebar-border px-4 py-3 bg-white">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-sky-600 shadow-lg shadow-sky-200">
          <GraduationCap className="h-5 w-5 text-white" />
        </div>
        <span className="font-display text-xs font-black text-slate-900 tracking-tight uppercase">Global Scholar</span>
      </div>
    </SidebarHeader>
    <SidebarContent className="bg-white">
      <SidebarGroup>
        <SidebarGroupLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-4 py-4">Academic Navigation</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu className="px-2">
            {items.map((item) => (
              <SidebarMenuItem key={item.title} className="mb-1">
                <SidebarMenuButton asChild>
                  <NavLink to={item.url} end className="flex items-center gap-3 px-4 py-6 rounded-2xl transition-all duration-200 text-slate-600 hover:bg-sky-50 hover:text-sky-700 group" activeClassName="bg-sky-100 text-sky-700 font-bold shadow-sm">
                    <item.icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                    <span className="text-sm">{item.title}</span>
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
