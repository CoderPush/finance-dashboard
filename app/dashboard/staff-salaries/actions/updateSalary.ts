'use server';
import { createClient } from '@/utils/supabase/server';

function parseNumber(val: FormDataEntryValue | null) {
  if (val === null || val === "") return null;
  return Number(val);
}

export async function updateSalary(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const id = formData.get('id');
  const month_id = formData.get('month_id');
  const gross_salary_vnd = parseNumber(formData.get('gross_salary_vnd'));
  const approved_salary_vnd = parseNumber(formData.get('approved_salary_vnd'));
  const gross_salary_usd = parseNumber(formData.get('gross_salary_usd'));
  const approved_salary_usd = parseNumber(formData.get('approved_salary_usd'));
  const approved_salary_usd_equiv = parseNumber(formData.get('approved_salary_usd_equiv'));

  if (!id) return { success: false, error: 'Missing id' };

  const supabase = await createClient();
  const { error } = await supabase.from('staff_salaries').update({
    month_id,
    gross_salary_vnd,
    approved_salary_vnd,
    gross_salary_usd,
    approved_salary_usd,
    approved_salary_usd_equiv,
  }).eq('id', id);

  if (error) {
    console.error('Error updating salary:', error);
    return { success: false, error: error.message };
  }
  return { success: true };
} 