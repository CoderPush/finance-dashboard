'use server';
import { createClient } from '@/utils/supabase/server';

export async function checkDuplicates(ids: string[], newMonthId: string) {
  const supabase = await createClient();
  // Fetch the selected salaries
  const { data: salaries } = await supabase
    .from('staff_salaries')
    .select(`id, staff_id, project_id, staff(full_name), projects(project_name), months(month_start)`) // include details for UI
    .in('id', ids);
  if (!salaries || salaries.length === 0) return { duplicates: [], toCreate: [] };

  // Fetch existing records for the target month and these staff/project combos
  const staffIds = salaries.map((s: any) => s.staff_id);
  const projectIds = salaries.map((s: any) => s.project_id);
  const { data: existing } = await supabase
    .from('staff_salaries')
    .select('staff_id, project_id')
    .eq('month_id', newMonthId)
    .in('staff_id', staffIds)
    .in('project_id', projectIds);

  // Build a set of existing staff_id+project_id for the target month
  const existingSet = new Set(
    (existing || []).map((e: any) => `${e.staff_id}_${e.project_id}`)
  );

  // Split into duplicates and toCreate
  const duplicates = salaries.filter((s: any) => existingSet.has(`${s.staff_id}_${s.project_id}`));
  const toCreate = salaries.filter((s: any) => !existingSet.has(`${s.staff_id}_${s.project_id}`));

  return { duplicates, toCreate };
} 