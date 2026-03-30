import { LayoutDashboard, Users, BookOpen, Shield, BarChart3, FileText, Upload, Tag, LineChart, Plug, Building2, KeyRound, CreditCard, Gavel, Store, Bot, Database, ScanEye, FileSearch, Network, ShoppingCart, Receipt, Key, RefreshCw, Palette, LifeBuoy, Radar, ScrollText, Map, LayoutGrid } from "lucide-react";
import GraduationCapIcon from "@/components/icons/GraduationCapIcon";
import { NavLink } from "@/components/NavLink";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader } from "@/components/ui/sidebar";

const items = [
  { title: "Overview", url: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Courses", url: "/admin/courses", icon: BookOpen },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
  { title: "Security", url: "/admin/security", icon: Shield },
  { title: "Audit Logs", url: "/admin/audit-logs", icon: FileText },
  { title: "Bulk Enrollment", url: "/admin/bulk-enrollment", icon: Upload },
  { title: "Categories", url: "/admin/categories", icon: Tag },
  { title: "Reports", url: "/admin/reports", icon: LineChart },
  { title: "Integrations", url: "/admin/integrations", icon: Plug },
  { title: "Tenants", url: "/admin/tenants", icon: Building2 },
  { title: "Permissions", url: "/admin/permissions", icon: KeyRound },
  { title: "Billing", url: "/admin/billing", icon: CreditCard },
  { title: "Accreditation", url: "/admin/accreditation", icon: GraduationCapIcon },
  { title: "Compliance", url: "/admin/compliance", icon: Gavel },
  { title: "Marketplace", url: "/admin/marketplace", icon: Store },
  { title: "AI Governance", url: "/admin/ai-governance", icon: Bot },
  { title: "Data Exports", url: "/admin/data-exports", icon: Database },
  { title: "Proctoring", url: "/admin/proctoring", icon: ScanEye },
  { title: "Plagiarism", url: "/admin/plagiarism", icon: FileSearch },
  { title: "Data Pipelines", url: "/admin/data-pipelines", icon: Network },
  { title: "Commerce", url: "/admin/commerce", icon: ShoppingCart },
  { title: "Marketplace Orders", url: "/admin/marketplace-orders", icon: Receipt },
  { title: "SSO Provisioning", url: "/admin/sso", icon: Key },
  { title: "Directory Sync", url: "/admin/directory-sync", icon: RefreshCw },
  { title: "Branding", url: "/admin/branding", icon: Palette },
  { title: "Support Center", url: "/admin/support", icon: LifeBuoy },
  { title: "Advanced Analytics", url: "/admin/advanced-analytics", icon: Radar },
  { title: "Accreditation Evidence", url: "/admin/accreditation-evidence", icon: ScrollText },
  { title: "Cohort Insights", url: "/admin/cohort-insights", icon: BarChart3 },
  { title: "Multi-Campus", url: "/admin/multi-campus", icon: Map },
  { title: "Catalog Segmentation", url: "/admin/catalog-segmentation", icon: LayoutGrid },
];

const AdminSidebar = () => (
  <Sidebar collapsible="icon">
    <SidebarHeader className="border-b border-sidebar-border px-4 py-3">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-brand">
          <svg className="h-4 w-4 text-primary-foreground" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="font-display text-sm font-bold text-sidebar-foreground">Global University Institute</span>
      </div>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">Administration</SidebarGroupLabel>
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

export default AdminSidebar;
