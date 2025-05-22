import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const supabase = await createClient();
  // Use a join to fetch client info with each project
  const { data: projects } = await supabase
    .from('projects')
    .select('id, project_name, project_type, created_at, client_id, clients(id, name)');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Badge>List</Badge>
      </div>
      <div className="w-full overflow-x-auto rounded border bg-background">
        <table className="w-full min-w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-2 text-left font-semibold">ID</th>
              <th className="px-4 py-2 text-left font-semibold">Project Name</th>
              <th className="px-4 py-2 text-left font-semibold">Type</th>
              <th className="px-4 py-2 text-left font-semibold">Client</th>
              <th className="px-4 py-2 text-left font-semibold">Created At</th>
              <th className="px-4 py-2 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects && projects.length > 0 ? (
              projects.map((project: any) => (
                <tr key={project.id} className="border-t">
                  <td className="px-4 py-2">{project.id}</td>
                  <td className="px-4 py-2">{project.project_name}</td>
                  <td className="px-4 py-2">{project.project_type || '-'}</td>
                  <td className="px-4 py-2">
                    {project.clients ? (
                      <Link href={`/dashboard/clients/${project.clients.id}`} className="text-primary underline hover:opacity-80">
                        {project.clients.name}
                      </Link>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-4 py-2">{project.created_at ? new Date(project.created_at).toLocaleString() : '-'}</td>
                  <td className="px-4 py-2">
                    <Link href={`/dashboard/projects/${project.id}`}>
                      <Button variant="outline" size="sm">View Details</Button>
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  No projects found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 