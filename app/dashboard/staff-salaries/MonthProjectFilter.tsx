"use client";
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

export function MonthProjectFilter({ months, projects, selectedMonth, selectedProject }: {
  months: any[];
  projects: any[];
  selectedMonth?: string;
  selectedProject?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Use 'all' as the default value for no filter
  const [month, setMonth] = useState(selectedMonth || 'all');
  const [project, setProject] = useState(selectedProject || 'all');

  useEffect(() => {
    setMonth(searchParams.get('month_id') || 'all');
    setProject(searchParams.get('project_id') || 'all');
  }, [searchParams]);

  function handleMonthChange(value: string) {
    setMonth(value);
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      params.set('month_id', value);
    } else {
      params.delete('month_id');
    }
    router.replace(`?${params.toString()}`);
  }

  function handleProjectChange(value: string) {
    setProject(value);
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      params.set('project_id', value);
    } else {
      params.delete('project_id');
    }
    router.replace(`?${params.toString()}`);
  }

  return (
    <div className="mb-4 flex flex-col sm:flex-row gap-4 items-start sm:items-end">
      <div>
        <Label htmlFor="month_id" className="mb-1 block text-sm font-medium">Month</Label>
        <Select onValueChange={handleMonthChange} value={month || 'all'}>
          <SelectTrigger id="month_id" className="w-40">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {months.map((m: any) => (
              <SelectItem key={m.id} value={String(m.id)}>
                {m.month_start}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="project_id" className="mb-1 block text-sm font-medium">Project</Label>
        <Select onValueChange={handleProjectChange} value={project || 'all'}>
          <SelectTrigger id="project_id" className="w-56">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {projects.map((p: any) => (
              <SelectItem key={p.id} value={String(p.id)}>
                {p.project_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
} 