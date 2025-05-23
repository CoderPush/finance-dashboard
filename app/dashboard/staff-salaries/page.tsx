import { createClient } from '@/utils/supabase/server';
import { Badge } from '@/components/ui/badge';
import { MonthProjectFilter } from './MonthProjectFilter';
import { SalaryTableWithDuplicate } from './SalaryTableWithDuplicate';
import { StaffSelect } from './StaffSelect';
import { Label } from '@/components/ui/label';

export default async function Page({ searchParams }: { searchParams?: Promise<Record<string, any>> }) {
  const supabase = await createClient();

  // Fetch all months and projects for the filter dropdowns
  const { data: months } = await supabase.from('months').select('id, month_start');
  const { data: projects } = await supabase.from('projects').select('id, project_name');
  const { data: staffList } = await supabase.from('staff').select('id, full_name');

  // Next.js 15: searchParams is now async
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const month_id = typeof resolvedSearchParams?.month_id === 'string' ? resolvedSearchParams.month_id : undefined;
  const project_id = typeof resolvedSearchParams?.project_id === 'string' ? resolvedSearchParams.project_id : undefined;
  const staff_id = typeof resolvedSearchParams?.staff_id === 'string' ? resolvedSearchParams.staff_id : undefined;

  // Pagination: get page and pageSize from searchParams (default page=1, pageSize=100)
  const page = Number(resolvedSearchParams?.page) || 1;
  const pageSize = Number(resolvedSearchParams?.pageSize) || 20;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // Build the query for staff_salaries, filter by month and project if selected
  let query = supabase
    .from('staff_salaries')
    .select(`
      id,
      created_at,
      gross_salary_vnd,
      approved_salary_vnd,
      gross_salary_usd,
      approved_salary_usd,
      staff_id,
      project_id,
      month_id,
      approved_salary_usd_equiv,
      projects(id, project_name),
      months(id, month_start),
      staff(id, full_name)
    `, { count: 'exact' })
    .range(from, to);

  if (month_id) {
    query = query.eq('month_id', month_id);
  }
  if (project_id) {
    query = query.eq('project_id', project_id);
  }
  if (staff_id) {
    query = query.eq('staff_id', staff_id);
  }

  const { data: salaries, count: totalCount } = await query;


  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">Staff Salaries</h1>
        <Badge>List</Badge>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-stretch gap-2 mb-2">
        <div className="flex flex-col sm:flex-row gap-2">
          <MonthProjectFilter
            months={months || []}
            projects={projects || []}
            selectedMonth={month_id}
            selectedProject={project_id}
          />
        </div>
        <div className="flex flex-col min-w-[14rem]">
          <Label htmlFor="staff-combobox" className="mb-1 block text-sm font-medium">Staff</Label>
          <StaffSelect staffList={staffList || []} selectedStaffId={staff_id} />
        </div>
      </div>
      <SalaryTableWithDuplicate
        salaries={salaries || []}
        months={months || []}
        projects={projects || []}
        page={page}
        pageSize={pageSize}
        totalCount={totalCount || 0}
      />
    </div>
  );
} 