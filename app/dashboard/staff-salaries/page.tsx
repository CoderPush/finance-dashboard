import { createClient } from '@/utils/supabase/server';
import { Badge } from '@/components/ui/badge';
import { MonthProjectFilter } from './MonthProjectFilter';
import { SalaryTableWithDuplicate } from './SalaryTableWithDuplicate';

export default async function Page({ searchParams }: { searchParams?: Record<string, any> }) {
  const supabase = await createClient();

  // Fetch all months and projects for the filter dropdowns
  const { data: months } = await supabase.from('months').select('id, month_start');
  const { data: projects } = await supabase.from('projects').select('id, project_name');

  // Next.js 15: searchParams is now async
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const month_id = typeof resolvedSearchParams?.month_id === 'string' ? resolvedSearchParams.month_id : undefined;
  const project_id = typeof resolvedSearchParams?.project_id === 'string' ? resolvedSearchParams.project_id : undefined;

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
    `);

  if (month_id) {
    query = query.eq('month_id', month_id);
  }
  if (project_id) {
    query = query.eq('project_id', project_id);
  }

  const { data: salaries } = await query;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">Staff Salaries</h1>
        <Badge>List</Badge>
      </div>
      <MonthProjectFilter
        months={months || []}
        projects={projects || []}
        selectedMonth={month_id}
        selectedProject={project_id}
      />
      <SalaryTableWithDuplicate
        salaries={salaries || []}
        months={months || []}
        projects={projects || []}
      />
    </div>
  );
} 