"use client";
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import * as React from 'react';
import { useRef } from 'react';
import { toast } from '@/components/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

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
      <SheetContent side="right" className="w-full max-w-md overflow-y-auto">
        <SheetTitle>Edit Staff Salary</SheetTitle>
        {salary && (
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 mt-4"
          >
            {/* Staff name (read-only) */}
            <div>
              <Label>Staff</Label>
              <div className="border rounded px-2 py-1 bg-muted">
                {salary.staff?.full_name || salary.staff_id}
              </div>
            </div>
            <input type="hidden" name="id" value={salary.id} />
            <Label htmlFor="month_id">Month</Label>
            <Select name="month_id"defaultValue={salary.month_id?.toString()}>
              <SelectTrigger id="month_id" className="border rounded px-2 py-1">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((m: any) => (
                  <SelectItem key={m.id} value={m.id.toString()}>{m.month_start}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-4">
              <div className="flex flex-col gap-2 w-1/2">
                <Label htmlFor="gross_salary_vnd">Gross Salary (VND)</Label>
                <Input id="gross_salary_vnd" name="gross_salary_vnd" type="number" defaultValue={salary.gross_salary_vnd} />
              </div>
              <div className="flex flex-col gap-2 w-1/2">
                <Label htmlFor="approved_salary_vnd">Approved Salary (VND)</Label>
                <Input id="approved_salary_vnd" name="approved_salary_vnd" type="number" defaultValue={salary.approved_salary_vnd} />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col gap-2 w-1/2">
                <Label htmlFor="gross_salary_usd">Gross Salary (USD)</Label>
                <Input id="gross_salary_usd" name="gross_salary_usd" type="number" defaultValue={salary.gross_salary_usd} />
              </div>
              <div className="flex flex-col gap-2 w-1/2">
                <Label htmlFor="approved_salary_usd">Approved Salary (USD)</Label>
                <Input id="approved_salary_usd" name="approved_salary_usd" type="number" defaultValue={salary.approved_salary_usd} />
              </div>
            </div>
            <Label htmlFor="approved_salary_usd_equiv">Approved Salary USD Equiv</Label>
            <Input id="approved_salary_usd_equiv" name="approved_salary_usd_equiv" type="number" defaultValue={salary.approved_salary_usd_equiv} />
            <Button type="submit" className="w-full">Save</Button>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
} 