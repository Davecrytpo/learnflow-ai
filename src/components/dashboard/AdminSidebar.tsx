import {
  BarChart3,
  BookOpen,
  Bot,
  Building2,
  CreditCard,
  Database,
  FileSearch,
  Globe,
  LayoutDashboard,
  LifeBuoy,
  LineChart,
  Plug,
  ScanEye,
  Shield,
  ShieldCheck,
  Users,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const operationsItems = [
  { title: "Overview", url: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Courses", url: "/admin/courses", icon: BookOpen },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
  { title: "Reports", url: "/admin/reports", icon: LineChart },
];

const securityItems = [
  { title: "Audit Logs", url: "/admin/audit-logs", icon: Shield },
  { title: "Permissions", url: "/admin/permissions", icon: ShieldCheck },
  { title: "SSO", url: "/admin/sso", icon: Globe },
  { title: "AI Governance", url: "/admin/ai-governance", icon: Bot },
  { title: "Compliance", url: "/admin/compliance", icon: ShieldCheck },
  { title: "Proctoring", url: "/admin/proctoring", icon: ScanEye },
  { title: "Plagiarism", url: "/admin/plagiarism", icon: FileSearch },
];

const platformItems = [
  { title: "Billing", url: "/admin/billing", icon: CreditCard },
  { title: "Support", url: "/admin/support", icon: LifeBuoy },
  { title: "Integrations", url: "/admin/integrations", icon: Plug },
  { title: "Tenants", url: "/admin/tenants", icon: Building2 },
  { title: "Data Exports", url: "/admin/data-exports", icon: Database },
  { title: "Data Pipelines", url: "/admin/data-pipelines", icon: Database },
  { title: "Directory Sync", url: "/admin/directory-sync", icon: Users },
];

const renderItems = (items: typeof operationsItems) =>
  items.map((item) => (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton asChild>
        <NavLink
          to={item.url}
          end
          className="gap-2.5 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          activeClassName="bg-primary/10 text-primary font-medium"
        >
          <item.icon className="h-4 w-4" />
          <span>{item.title}</span>
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  ));

const AdminSidebar = () => (
  <Sidebar collapsible="icon">
    <SidebarHeader className="border-b border-sidebar-border px-4 py-3">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-brand">
          <svg className="h-4 w-4 text-primary-foreground" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span className="font-display text-sm font-bold text-sidebar-foreground">Global University Institute</span>
      </div>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">Administration</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>{renderItems(operationsItems)}</SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">Security</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>{renderItems(securityItems)}</SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">Platform Ops</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>{renderItems(platformItems)}</SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
);

export default AdminSidebar;
