import { createClient } from '@/utils/supabase/server'
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export const dynamic = 'force-dynamic';

export default async function Page({ searchParams }: { searchParams?: Promise<Record<string, any>> }) {
  const supabase = await createClient();
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const email = resolvedSearchParams?.email || '';
  let query = supabase.from('staff').select();
  if (email) {
    query = query.ilike('email', `%${email}%`); // case-insensitive partial match
  }
  const { data: staffs } = await query;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">Staffs</h1>
        <Badge>List</Badge>
      </div>
      <form method="GET" className="flex items-end gap-2">
        <div className="flex-1">
          <Label htmlFor="email">Search by Email</Label>
          <Input
            id="email"
            name="email"
            placeholder="Enter email..."
            defaultValue={email}
            className="mt-1"
            autoComplete="off"
          />
        </div>
        <Button type="submit" className="h-10">Search</Button>
      </form>
      <div className="w-full overflow-x-auto rounded border bg-background">
        <table className="w-full min-w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-2 text-left font-semibold">ID</th>
              <th className="px-4 py-2 text-left font-semibold">Full Name</th>
              <th className="px-4 py-2 text-left font-semibold">Email</th>
              <th className="px-4 py-2 text-left font-semibold">Role</th>
              <th className="px-4 py-2 text-left font-semibold">Bonus</th>
              <th className="px-4 py-2 text-left font-semibold">Recruitment Fee</th>
              <th className="px-4 py-2 text-left font-semibold">Revenue Generating</th>
            </tr>
          </thead>
          <tbody>
            {staffs && staffs.length > 0 ? (
              staffs.map((staff: any) => (
                <tr key={staff.id} className="border-t">
                  <td className="px-4 py-2">{staff.id}</td>
                  <td className="px-4 py-2">{staff.full_name}</td>
                  <td className="px-4 py-2">{staff.email}</td>
                  <td className="px-4 py-2">{staff.role || <span className="text-muted-foreground">-</span>}</td>
                  <td className="px-4 py-2">{staff.bonus_amount}</td>
                  <td className="px-4 py-2">{staff.recruitment_fee}</td>
                  <td className="px-4 py-2">
                    {staff.is_revenue_generating ? (
                      <Badge variant="secondary">Yes</Badge>
                    ) : (
                      <Badge variant="outline">No</Badge>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  No staff found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
