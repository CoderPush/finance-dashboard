import { createClient } from '@/utils/supabase/server';
import { Badge } from '@/components/ui/badge';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const clientId = id;

  // Fetch client by id
  const { data: client } = await supabase.from('clients').select('*').eq('id', clientId).single();
  if (!client) return notFound();

  // Fetch projects for this client
  const { data: projects } = await supabase.from('projects').select('*').eq('client_id', clientId);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">Client: {client.name}</h1>
        <Badge>Detail</Badge>
      </div>
      <div className="space-y-2">
        <div><span className="font-semibold">ID:</span> {client.id}</div>
        <div><span className="font-semibold">Email:</span> {client.email || '-'}</div>
        <div><span className="font-semibold">Created At:</span> {client.created_at ? new Date(client.created_at).toLocaleString() : '-'}</div>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Projects</h2>
        <div className="w-full overflow-x-auto rounded border bg-background">
          <table className="w-full min-w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">ID</th>
                <th className="px-4 py-2 text-left font-semibold">Project Name</th>
                <th className="px-4 py-2 text-left font-semibold">Type</th>
                <th className="px-4 py-2 text-left font-semibold">Status</th>
                <th className="px-4 py-2 text-left font-semibold">Description</th>
                <th className="px-4 py-2 text-left font-semibold">Created At</th>
              </tr>
            </thead>
            <tbody>
              {projects && projects.length > 0 ? (
                projects.map((project: any) => (
                  <tr key={project.id} className="border-t">
                    <td className="px-4 py-2">{project.id}</td>
                    <td className="px-4 py-2">{project.project_name}</td>
                    <td className="px-4 py-2">{project.project_type || '-'}</td>
                    <td className="px-4 py-2">{project.status || '-'}</td>
                    <td className="px-4 py-2">{project.description || '-'}</td>
                    <td className="px-4 py-2">{project.created_at ? new Date(project.created_at).toLocaleString() : '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    No projects found for this client.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 