"use client";
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import * as React from 'react';
import { useRef } from 'react';
import { toast } from '@/components/hooks/use-toast';
import { useRouter } from 'next/navigation';

export function EditSalarySheet({ open, onOpenChange, salary, months, updateSalaryAction }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  salary: any;
  months: any[];
  updateSalaryAction: (formData: FormData) => Promise<{ success: boolean; error?: string }>;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await updateSalaryAction(formData);
    console.log('updateSalaryAction result:', result);
    if (result?.success) {
      toast({ title: 'Success', description: 'Salary updated successfully!' });
      onOpenChange(false);
      router.refresh();
    } else {
      toast({ title: 'Error', description: result?.error || 'Update failed.' });
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-md">
        <SheetTitle>Edit Staff Salary</SheetTitle>
        {salary && (
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 mt-4"
          >
            {/* Staff name (read-only) */}
            <div>
              <label className="block font-medium">Staff</label>
              <div className="border rounded px-2 py-1 bg-muted">
                {salary.staff?.full_name || salary.staff_id}
              </div>
            </div>
            <input type="hidden" name="id" value={salary.id} />
            <label className="block font-medium">Month</label>
            <select name="month_id" defaultValue={salary.month_id} className="border rounded px-2 py-1">
              {months.map((m: any) => (
                <option key={m.id} value={m.id}>{m.month_start}</option>
              ))}
            </select>
            <label className="block font-medium">Gross Salary (VND)</label>
            <input name="gross_salary_vnd" type="number" defaultValue={salary.gross_salary_vnd} className="border rounded px-2 py-1" />
            <label className="block font-medium">Approved Salary (VND)</label>
            <input name="approved_salary_vnd" type="number" defaultValue={salary.approved_salary_vnd} className="border rounded px-2 py-1" />
            <label className="block font-medium">Gross Salary (USD)</label>
            <input name="gross_salary_usd" type="number" defaultValue={salary.gross_salary_usd} className="border rounded px-2 py-1" />
            <label className="block font-medium">Approved Salary (USD)</label>
            <input name="approved_salary_usd" type="number" defaultValue={salary.approved_salary_usd} className="border rounded px-2 py-1" />
            <label className="block font-medium">Approved Salary USD Equiv</label>
            <input name="approved_salary_usd_equiv" type="number" defaultValue={salary.approved_salary_usd_equiv} className="border rounded px-2 py-1" />
            <Button type="submit" className="w-full">Save</Button>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
} 