'use server';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createInvoice(formData: FormData) {
  const supabase = await createClient();
  const project_id = formData.get('project_id');
  const month_id = formData.get('month_id');
  const total_amount_usd = formData.get('total_amount_usd');
  const discount_usd = formData.get('discount_usd');
  const grand_total_usd = formData.get('grand_total_usd');
  const commission_usd = formData.get('commission_usd');

  await supabase.from('invoices').insert([{
    project_id,
    month_id,
    total_amount_usd: Number(total_amount_usd),
    discount_usd: discount_usd ? Number(discount_usd) : null,
    grand_total_usd: Number(grand_total_usd),
    commission_usd: commission_usd ? Number(commission_usd) : null,
  }]);

  revalidatePath('/dashboard/invoices');
} 