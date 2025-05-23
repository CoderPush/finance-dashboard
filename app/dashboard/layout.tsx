import Link from 'next/link';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset
} from '@/components/ui/sidebar';
import { LayoutDashboard, Users, User, FolderKanban, FileText, DollarSign } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
        <Sidebar className="z-0 border-r border-border bg-gray-50 pt-20 w-40">
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href="/dashboard" passHref>
                  <SidebarMenuButton asChild isActive={false} className="px-4 py-2 flex items-center gap-2">
                    <span className="flex items-center gap-2">
                      <LayoutDashboard className="w-5 h-5" />
                      <span>Dashboard</span>
                    </span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/dashboard/staffs" passHref>
                  <SidebarMenuButton asChild isActive={false} className="px-4 py-2 flex items-center gap-2">
                    <span className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      <span>Staffs</span>
                    </span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/dashboard/clients" passHref>
                  <SidebarMenuButton asChild isActive={false} className="px-4 py-2 flex items-center gap-2">
                    <span className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      <span>Clients</span>
                    </span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/dashboard/projects" passHref>
                  <SidebarMenuButton asChild isActive={false} className="px-4 py-2 flex items-center gap-2">
                    <span className="flex items-center gap-2">
                      <FolderKanban className="w-5 h-5" />
                      <span>Projects</span>
                    </span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/dashboard/invoices" passHref>
                  <SidebarMenuButton asChild isActive={false} className="px-4 py-2 flex items-center gap-2">
                    <span className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      <span>Invoices</span>
                    </span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/dashboard/staff-salaries" passHref>
                  <SidebarMenuButton asChild isActive={false} className="px-4 py-2 flex items-center gap-2">
                    <span className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      <span>Staff Salaries</span>
                    </span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <div className="w-full min-w-[1000px]">{children}</div>
    </SidebarProvider>
  );
} 