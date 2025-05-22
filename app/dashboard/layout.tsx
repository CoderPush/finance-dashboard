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

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
        <Sidebar className="z-0 border-r border-border bg-gray-50 pt-20">
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href="/dashboard" passHref>
                  <SidebarMenuButton asChild isActive={false} className="px-4 py-2">
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/dashboard/staffs" passHref>
                  <SidebarMenuButton asChild isActive={false} className="px-4 py-2">
                    <span>Staffs</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/dashboard/clients" passHref>
                  <SidebarMenuButton asChild isActive={false} className="px-4 py-2">
                    <span>Clients</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/dashboard/projects" passHref>
                  <SidebarMenuButton asChild isActive={false} className="px-4 py-2">
                    <span>Projects</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/dashboard/invoices" passHref>
                  <SidebarMenuButton asChild isActive={false} className="px-4 py-2">
                    <span>Invoices</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/dashboard/staff-salaries" passHref>
                  <SidebarMenuButton asChild isActive={false} className="px-4 py-2">
                    <span>Staff Salaries</span>
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