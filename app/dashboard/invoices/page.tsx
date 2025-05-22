import { createClient } from '@/utils/supabase/server'
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { MonthProjectFilter } from '../staff-salaries/MonthProjectFilter';
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { createInvoice } from './actions';

export default async function Page({ searchParams }: { searchParams?: Record<string, any> }) {
  const supabase = await createClient();

  // Fetch months and projects for the filter
  const { data: months } = await supabase.from('months').select('id, month_start');
  const { data: projects } = await supabase.from('projects').select('id, project_name');

  // Next.js 15: Await searchParams
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const month_id = typeof resolvedSearchParams?.month_id === 'string' ? resolvedSearchParams.month_id : undefined;
  const project_id = typeof resolvedSearchParams?.project_id === 'string' ? resolvedSearchParams.project_id : undefined;

  // Build the invoices query
  let query = supabase
    .from('invoices')
    .select(`
      id,
      total_amount_usd,
      discount_usd,
      grand_total_usd,
      commission_usd,
      project_id,
      month_id,
      projects(id, project_name),
      months(id, month_start)
    `);

  if (month_id) {
    query = query.eq('month_id', month_id);
  }
  if (project_id) {
    query = query.eq('project_id', project_id);
  }

  const { data: invoices } = await query;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Invoices</h1>
          <Badge>List</Badge>
        </div>
        {/* Modal trigger and modal for creating invoice */}
        <Sheet>
          <SheetTrigger asChild>
            <Button className="mb-2">+ New Invoice</Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full max-w-md">
            <SheetTitle>Create Invoice</SheetTitle>
            <form action={createInvoice} className="flex flex-col gap-4">
              <div>
                <label className="block mb-1 font-medium">Project</label>
                <select name="project_id" required className="border rounded px-2 py-1 w-full">
                  <option value="">Select project</option>
                  {projects?.map((p: any) => (
                    <option key={p.id} value={p.id}>{p.project_name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium">Month</label>
                <select name="month_id" required className="border rounded px-2 py-1 w-full">
                  <option value="">Select month</option>
                  {months?.map((m: any) => (
                    <option key={m.id} value={m.id}>{m.month_start}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium">Total (USD)</label>
                <input name="total_amount_usd" type="number" step="0.01" required className="border rounded px-2 py-1 w-full" />
              </div>
              <div>
                <label className="block mb-1 font-medium">Discount (USD)</label>
                <input name="discount_usd" type="number" step="0.01" className="border rounded px-2 py-1 w-full" />
              </div>
              <div>
                <label className="block mb-1 font-medium">Grand Total (USD)</label>
                <input name="grand_total_usd" type="number" step="0.01" required className="border rounded px-2 py-1 w-full" />
              </div>
              <div>
                <label className="block mb-1 font-medium">Commission (USD)</label>
                <input name="commission_usd" type="number" step="0.01" className="border rounded px-2 py-1 w-full" />
              </div>
              <Button type="submit" className="w-full">Create Invoice</Button>
            </form>
          </SheetContent>
        </Sheet>
      </div>
      <MonthProjectFilter
        months={months || []}
        projects={projects || []}
        selectedMonth={month_id}
        selectedProject={project_id}
      />
      <div className="w-full overflow-x-auto rounded border bg-background">
        <table className="w-full min-w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-2 text-left font-semibold">ID</th>
              <th className="px-4 py-2 text-left font-semibold">Project</th>
              <th className="px-4 py-2 text-left font-semibold">Month</th>
              <th className="px-4 py-2 text-left font-semibold">Total (USD)</th>
              <th className="px-4 py-2 text-left font-semibold">Discount (USD)</th>
              <th className="px-4 py-2 text-left font-semibold">Grand Total (USD)</th>
              <th className="px-4 py-2 text-left font-semibold">Commission (USD)</th>
            </tr>
          </thead>
          <tbody>
            {(invoices || []).map((invoice: any) => (
              <tr key={invoice.id} className="border-t">
                <td className="px-4 py-2">{invoice.id}</td>
                <td className="px-4 py-2">
                  {invoice.projects?.project_name ? (
                    <Link href={`/dashboard/projects/${invoice.projects.id}`} className="text-primary underline hover:opacity-80">
                      {invoice.projects.project_name}
                    </Link>
                  ) : (
                    invoice.project_id
                  )}
                </td>
                <td className="px-4 py-2">{invoice.months?.month_start || invoice.month_id}</td>
                <td className="px-4 py-2">{invoice.total_amount_usd}</td>
                <td className="px-4 py-2">{invoice.discount_usd ?? '-'}</td>
                <td className="px-4 py-2">{invoice.grand_total_usd}</td>
                <td className="px-4 py-2">{invoice.commission_usd}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 