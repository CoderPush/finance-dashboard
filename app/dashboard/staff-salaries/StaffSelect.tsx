"use client";
import { Combobox } from '@/components/ui/combobox';
import { useRouter, useSearchParams } from 'next/navigation';

export function StaffSelect({ staffList, selectedStaffId }: { staffList: { id: string; full_name: string }[]; selectedStaffId?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <Combobox
      options={staffList.map(staff => ({ value: String(staff.id), label: staff.full_name }))}
      value={selectedStaffId}
      onChange={staffId => {
        const params = new URLSearchParams(searchParams.toString());
        if (staffId) {
          params.set('staff_id', staffId);
        } else {
          params.delete('staff_id');
        }
        params.set('page', '1'); // Reset to first page on filter
        router.replace(`?${params.toString()}`);
      }}
      placeholder="Search and select staff..."
      clearable
    />
  );
} 