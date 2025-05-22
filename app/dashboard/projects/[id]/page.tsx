import { createClient } from '@/utils/supabase/server';
import { Badge } from '@/components/ui/badge';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: { id: string };
}

export default async function Page({ params }: PageProps) {
  const supabase = await createClient();
  const projectId = await params.id;

  // Fetch project by id, including client info
  const { data: project } = await supabase
    .from('projects')
    .select('*, clients(id, name)')
    .eq('id', projectId)
    .single();

  if (!project) return notFound();

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">Project: {project.project_name}</h1>
        <Badge>Detail</Badge>
      </div>
      <div className="space-y-2">
        <div><span className="font-semibold">ID:</span> {project.id}</div>
        <div><span className="font-semibold">Type:</span> {project.project_type || '-'}</div>
        <div><span className="font-semibold">Status:</span> {project.status || '-'}</div>
        <div><span className="font-semibold">Description:</span> {project.description || '-'}</div>
        <div>
          <span className="font-semibold">Client:</span>{' '}
          {project.clients ? (
            <Link href={`/dashboard/clients/${project.clients.id}`} className="text-primary underline hover:opacity-80">
              {project.clients.name}
            </Link>
          ) : (
            '-'
          )}
        </div>
        <div><span className="font-semibold">Created At:</span> {project.created_at ? new Date(project.created_at).toLocaleString() : '-'}</div>
      </div>
    </div>
  );
} 