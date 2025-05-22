'use server';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function duplicateSalaries(ids: string[], newMonthId: string) {
  const supabase = await createClient();
  // Fetch the selected salaries
  const { data: salaries } = await supabase
    .from('staff_salaries')
    .select('*')
    .in('id', ids);
  if (!salaries || salaries.length === 0) return;

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

  // Prepare new records, skipping duplicates
  const newRecords = salaries
    .filter((s: any) => !existingSet.has(`${s.staff_id}_${s.project_id}`))
    .map((s: any) => {
      const { id, created_at, ...rest } = s;
      return {
        ...rest,
        month_id: newMonthId,
      };
    });

  if (newRecords.length > 0) {
    const { error } = await supabase.from('staff_salaries').insert(newRecords);
    if (error) {
      console.error('Insert error:', error);
      return { error: error.message };
    }
    revalidatePath('/dashboard/staff-salaries');
    return { created: newRecords.length };
  }
  return { created: 0 };
} 