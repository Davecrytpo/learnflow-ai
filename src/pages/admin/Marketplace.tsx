import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Store, Star } from "lucide-react";

const listings = [
  { id: "MK-21", name: "Data Literacy Bundle", provider: "SkillForge", rating: 4.8, status: "Active" },
  { id: "MK-18", name: "Leadership Sprint", provider: "Northwind Academy", rating: 4.6, status: "Active" },
  { id: "MK-14", name: "AI Ethics Microcourse", provider: "EthicLab", rating: 4.4, status: "Draft" },
];

const badgeFor = (status: string) => {
  if (status === "Active") return "bg-emerald-500/10 text-emerald-600";
  return "bg-slate-500/10 text-slate-600";
};

const AdminMarketplace = () => (
  <DashboardLayout allowedRoles={["admin"]} sidebar={<AdminSidebar />}>
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/70 bg-card/90 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Marketplace</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Content partnerships</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Curate marketplace offerings, manage providers, and track adoption.
            </p>
          </div>
          <Button className="bg-gradient-brand text-primary-foreground">
            <Store className="mr-2 h-4 w-4" /> Add listing
          </Button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active listings</CardTitle>
            <Store className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">28</p>
            <p className="text-xs text-muted-foreground">Published</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Providers</CardTitle>
            <Badge className="bg-primary/10 text-primary" variant="secondary">11</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">11</p>
            <p className="text-xs text-muted-foreground">Curated partners</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg rating</CardTitle>
            <Star className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">4.7</p>
            <p className="text-xs text-muted-foreground">Based on 2.4k ratings</p>
          </CardContent>
        </Card>
      </div>

      <Card className="p-4">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg">Listings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-0 pb-0">
          {listings.map((listing) => (
            <div key={listing.id} className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-semibold text-foreground">{listing.name}</p>
                <p className="text-xs text-muted-foreground">Provider: {listing.provider}</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>{listing.rating}★</span>
                <Badge className={badgeFor(listing.status)} variant="secondary">{listing.status}</Badge>
                <Button size="sm" variant="outline">Manage</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export default AdminMarketplace;
