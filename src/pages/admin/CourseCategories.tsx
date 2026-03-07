import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tag, Trash2, FolderTree, Loader2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const CourseCategories = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState("");
  const [adding, setAdding] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await (supabase
      .from as any)("course_categories")
      .select("*")
      .order("name", { ascending: true });
    
    if (error) {
      toast({ title: "Failed to load categories", description: error.message, variant: "destructive" });
    } else {
      setCategories(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    
    setAdding(true);
    const slug = newCategory.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    
    const { error } = await (supabase
      .from as any)("course_categories")
      .insert({ name: newCategory, slug });

    if (error) {
      toast({ title: "Error creating category", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Category created", description: `"${newCategory}" added to catalog.` });
      setNewCategory("");
      fetchCategories();
    }
    setAdding(false);
  };

  const deleteCategory = async (id: string) => {
    if (!window.confirm("Are you sure? This action cannot be undone.")) return;

    const { error } = await supabase
      .from("course_categories")
      .delete()
      .eq("id", id);

    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Category deleted" });
      fetchCategories();
    }
  };

  return (
    <DashboardLayout allowedRoles={["admin"]} sidebar={<AdminSidebar />}>
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/90 p-6">
          <div className="absolute inset-0 bg-aurora opacity-60" />
          <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.03]" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Taxonomy</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Course Categories</h1>
            <p className="mt-2 text-sm text-muted-foreground">Organize your course catalog with a structured hierarchy.</p>
          </div>
        </section>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-1 h-fit">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="h-4 w-4 text-primary" /> Create Category
              </CardTitle>
              <CardDescription>Add a new top-level category.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={addCategory} className="space-y-4">
                <div className="space-y-2">
                  <Input 
                    placeholder="Category Name (e.g. Data Science)" 
                    value={newCategory} 
                    onChange={(e) => setNewCategory(e.target.value)} 
                    disabled={adding}
                  />
                  <p className="text-xs text-muted-foreground">
                    Slug will be auto-generated: <span className="font-mono text-primary">{newCategory ? newCategory.toLowerCase().replace(/[^a-z0-9]+/g, "-") : "..."}</span>
                  </p>
                </div>
                <Button className="w-full" type="submit" disabled={adding || !newCategory.trim()}>
                  {adding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Add Category
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FolderTree className="h-4 w-4 text-primary" /> Existing Categories
              </CardTitle>
              <CardDescription>Manage {categories.length} active categories.</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
              ) : categories.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No categories defined yet.</div>
              ) : (
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <div key={cat.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/50 hover:bg-accent/5 transition-colors group">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <Tag className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-foreground">{cat.name}</p>
                          <p className="text-xs text-muted-foreground font-mono">/{cat.slug}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs font-normal">0 Courses</Badge>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => deleteCategory(cat.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CourseCategories;
