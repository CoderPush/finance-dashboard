import { createClient } from '@/utils/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Users, Building2, FolderKanban, FileText } from 'lucide-react';

export default async function DashboardPage() {
  const supabase = await createClient();

  // Fetch counts
  const { count: staffCount } = await supabase.from('staff').select('id', { count: 'exact', head: true });
  const { count: clientCount } = await supabase.from('clients').select('id', { count: 'exact', head: true });
  const { count: projectCount } = await supabase.from('projects').select('id', { count: 'exact', head: true });
  const { count: invoiceCount } = await supabase.from('invoices').select('id', { count: 'exact', head: true });

  const cards = [
    {
      title: 'Staff',
      count: staffCount ?? '-',
      icon: <Users className="w-8 h-8 text-blue-500" />,
      href: '/dashboard/staffs',
      subtitle: 'Total staff members',
    },
    {
      title: 'Clients',
      count: clientCount ?? '-',
      icon: <Building2 className="w-8 h-8 text-green-500" />,
      href: '/dashboard/clients',
      subtitle: 'Total clients',
    },
    {
      title: 'Projects',
      count: projectCount ?? '-',
      icon: <FolderKanban className="w-8 h-8 text-purple-500" />,
      href: '/dashboard/projects',
      subtitle: 'Total projects',
    },
    {
      title: 'Invoices',
      count: invoiceCount ?? '-',
      icon: <FileText className="w-8 h-8 text-orange-500" />,
      href: '/dashboard/invoices',
      subtitle: 'Total invoices',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
      {cards.map((card) => (
        <Link key={card.title} href={card.href} className="group">
          <Card className="transition-all group-hover:shadow-lg group-hover:scale-105 cursor-pointer border-primary/30 border-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">{card.title}</CardTitle>
              {card.icon}
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-1">{card.count}</div>
              <div className="text-muted-foreground text-xs">{card.subtitle}</div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
