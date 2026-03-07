import PageLayout from "@/components/layout/PageLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const fees = [
  { item: "Tuition (Full-Time)", cost: "$58,000" },
  { item: "Housing & Dining", cost: "$18,500" },
  { item: "Student Services Fee", cost: "$1,200" },
  { item: "Books & Supplies (Est.)", cost: "$1,500" },
  { item: "Personal Expenses (Est.)", cost: "$2,800" },
];

const Tuition = () => {
  return (
    <PageLayout 
      title="Tuition & Financial Aid" 
      description="Investing in your future is a significant commitment. We are committed to making it affordable."
      backgroundImage="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=2000"
    >
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl font-display font-bold mb-6">Cost of Attendance (2026-2027)</h2>
            <div className="border rounded-xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Annual Cost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fees.map((f) => (
                    <TableRow key={f.item}>
                      <TableCell className="font-medium">{f.item}</TableCell>
                      <TableCell className="text-right">{f.cost}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/50 font-bold">
                    <TableCell>Total Estimated Cost</TableCell>
                    <TableCell className="text-right">$82,000</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-display font-bold mb-6">Financial Aid</h2>
            <p className="text-lg text-muted-foreground mb-6">
              We practice need-blind admission and meet 100% of demonstrated financial need for all admitted students.
            </p>
            <div className="space-y-6">
               <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                 <h3 className="font-bold text-emerald-800 mb-2">Scholarships</h3>
                 <p className="text-emerald-700 text-sm">Merit-based awards ranging from $5,000 to full tuition.</p>
               </div>
               <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                 <h3 className="font-bold text-blue-800 mb-2">Grants</h3>
                 <p className="text-blue-700 text-sm">Need-based grants that do not need to be repaid.</p>
               </div>
               <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100">
                 <h3 className="font-bold text-amber-800 mb-2">Work-Study</h3>
                 <p className="text-amber-700 text-sm">Part-time campus jobs to help cover personal expenses.</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Tuition;
