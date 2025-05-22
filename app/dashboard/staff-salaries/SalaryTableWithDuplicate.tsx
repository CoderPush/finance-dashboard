"use client";
import { useState } from 'react';
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { duplicateSalaries } from './actions/duplicateSalaries';
import { checkDuplicates } from './actions/checkDuplicates';

export function SalaryTableWithDuplicate({ salaries, months, projects }: { salaries: any[]; months: any[]; projects: any[] }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [targetMonth, setTargetMonth] = useState('');
  const [duplicates, setDuplicates] = useState<any[]>([]);
  const [toCreate, setToCreate] = useState<any[]>([]);
  const [checked, setChecked] = useState(false); // confirmation checkbox
  const [loading, setLoading] = useState(false);
  const allIds = salaries.map((s) => String(s.id));
  const allSelected = selected.length === allIds.length && allIds.length > 0;

  function toggleSelect(id: string) {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }
  function toggleSelectAll() {
    setSelected(allSelected ? [] : allIds);
  }
  function openModal() { setModalOpen(true); }
  function closeModal() {
    setModalOpen(false);
    setTargetMonth('');
    setDuplicates([]);
    setToCreate([]);
    setChecked(false);
    setLoading(false);
  }

  async function handleMonthChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    setTargetMonth(value);
    setDuplicates([]);
    setToCreate([]);
    setChecked(false);
    if (value && selected.length > 0) {
      setLoading(true);
      const result = await checkDuplicates(selected, value);
      setDuplicates(result.duplicates);
      setToCreate(result.toCreate);
      setLoading(false);
    }
  }

  async function handleDuplicate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!targetMonth || selected.length === 0 || !toCreate.length || !checked) return;
    await duplicateSalaries(selected, targetMonth);
    closeModal();
    window.location.reload();
  }

  return (
    <div>
      <div className="mb-2 flex gap-2 items-center">
        <Button disabled={selected.length === 0} onClick={openModal} variant="default">Duplicate for New Month</Button>
        <span className="text-sm text-muted-foreground">{selected.length} selected</span>
      </div>
      <Sheet open={modalOpen} onOpenChange={setModalOpen}>
        <SheetContent side="right" className="w-full max-w-xs">
          <SheetTitle>Duplicate Salaries</SheetTitle>
          <form onSubmit={handleDuplicate} className="flex flex-col gap-4 mt-4">
            <label className="block font-medium">Target Month</label>
            <select
              className="border rounded px-2 py-1"
              value={targetMonth}
              onChange={handleMonthChange}
              required
            >
              <option value="">Select month</option>
              {months.map((m: any) => (
                <option key={m.id} value={m.id}>{m.month_start}</option>
              ))}
            </select>
            {loading && <div className="text-sm text-muted-foreground">Checking for duplicates...</div>}
            {targetMonth && !loading && (
              <div className="text-sm">
                <div className="mb-2">
                  <b>{toCreate.length}</b> will be <span className="text-green-700">created</span>:
                  <ul className="list-disc ml-5">
                    {toCreate.map((s: any) => (
                      <li key={s.id}>{s.staff?.full_name || s.staff_id} - {s.projects?.project_name || s.project_id}</li>
                    ))}
                  </ul>
                </div>
                <div className="mb-2">
                  <b>{duplicates.length}</b> <span className="text-red-700">already exist</span>:
                  <ul className="list-disc ml-5">
                    {duplicates.map((s: any) => (
                      <li key={s.id}>{s.staff?.full_name || s.staff_id} - {s.projects?.project_name || s.project_id}</li>
                    ))}
                  </ul>
                </div>
                {toCreate.length === 0 && <div className="text-red-700">No new records to create for this month.</div>}
                {toCreate.length > 0 && (
                  <label className="flex items-center gap-2 mt-2">
                    <input type="checkbox" checked={checked} onChange={e => setChecked(e.target.checked)} />
                    I confirm to create {toCreate.length} new record(s) for the selected month.
                  </label>
                )}
              </div>
            )}
            <Button type="submit" disabled={!targetMonth || !toCreate.length || !checked} className="w-full">Duplicate</Button>
            <Button type="button" variant="outline" onClick={closeModal} className="w-full">Cancel</Button>
          </form>
        </SheetContent>
      </Sheet>
      <div className="w-full overflow-x-auto rounded border bg-background mt-2">
        <table className="w-full min-w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-2"><input type="checkbox" checked={allSelected} onChange={toggleSelectAll} /></th>
              <th className="px-4 py-2 text-left font-semibold">ID</th>
              <th className="px-4 py-2 text-left font-semibold">Staff</th>
              <th className="px-4 py-2 text-left font-semibold">Project</th>
              <th className="px-4 py-2 text-left font-semibold">Month</th>
              <th className="px-4 py-2 text-left font-semibold">Gross Salary (VND)</th>
              <th className="px-4 py-2 text-left font-semibold">Approved Salary (VND)</th>
              <th className="px-4 py-2 text-left font-semibold">Gross Salary (USD)</th>
              <th className="px-4 py-2 text-left font-semibold">Approved Salary (USD)</th>
              <th className="px-4 py-2 text-left font-semibold">Approved Salary USD Equiv</th>
              <th className="px-4 py-2 text-left font-semibold">Created At</th>
            </tr>
          </thead>
          <tbody>
            {salaries.map((salary: any) => (
              <tr key={salary.id} className="border-t">
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selected.includes(String(salary.id))}
                    onChange={() => toggleSelect(String(salary.id))}
                  />
                </td>
                <td className="px-4 py-2">{salary.id}</td>
                <td className="px-4 py-2">
                  {salary.staff?.full_name ? (
                    <Link href={`/dashboard/staffs/${salary.staff.id}`} className="text-primary hover:underline hover:opacity-80">
                      {salary.staff.full_name}
                    </Link>
                  ) : (
                    salary.staff_id
                  )}
                </td>
                <td className="px-4 py-2">
                  {salary.projects?.project_name ? (
                    <Link href={`/dashboard/projects/${salary.projects.id}`} className="text-primary hover:underline hover:opacity-80">
                      {salary.projects.project_name}
                    </Link>
                  ) : (
                    salary.project_id
                  )}
                </td>
                <td className="px-4 py-2">{salary.months?.month_start || salary.month_id}</td>
                <td className="px-4 py-2">{salary.gross_salary_vnd}</td>
                <td className="px-4 py-2">{salary.approved_salary_vnd}</td>
                <td className="px-4 py-2">{salary.gross_salary_usd}</td>
                <td className="px-4 py-2">{salary.approved_salary_usd}</td>
                <td className="px-4 py-2">{salary.approved_salary_usd_equiv}</td>
                <td className="px-4 py-2">{salary.created_at ? new Date(salary.created_at).toISOString().slice(0, 10) : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 