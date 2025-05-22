import Link from 'next/link';
import { createClient } from '@/utils/supabase/server'
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const supabase = await createClient();
  const { data: clients } = await supabase.from('clients').select('*');
  // Fetch project counts for each client
  const { data: projects } = await supabase.from('projects').select('id,client_id');
  // Build a map of client_id to project count
  const projectCountMap = (projects || []).reduce((acc: Record<string, number>, project: any) => {
    acc[project.client_id] = (acc[project.client_id] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">Clients</h1>
        <Badge>List</Badge>
      </div>
      <div className="w-full overflow-x-auto rounded border bg-background">
        <table className="w-full min-w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-2 text-left font-semibold">ID</th>
              <th className="px-4 py-2 text-left font-semibold">Name</th>
              <th className="px-4 py-2 text-left font-semibold">Created At</th>
              <th className="px-4 py-2 text-left font-semibold">Number of projects</th>
              <th className="px-4 py-2 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients && clients.length > 0 ? (
              clients.map((client: any) => (
                <tr key={client.id} className="border-t">
                  <td className="px-4 py-2">{client.id}</td>
                  <td className="px-4 py-2">{client.name}</td>
                  <td className="px-4 py-2">{client.created_at ? new Date(client.created_at).toLocaleString() : '-'}</td>
                  <td className="px-4 py-2 text-center">{projectCountMap[client.id] || 0}</td>
                  <td className="px-4 py-2">
                    <Link href={`/dashboard/clients/${client.id}`}>
                      <Button variant="outline" size="sm">View Details</Button>
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  No clients found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 