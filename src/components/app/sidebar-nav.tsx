'use client';

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  ClipboardList,
  Clapperboard,
  Presentation,
  AreaChart,
  Scale,
  User,
  FileText as DocumentationIcon,
  Rss,
  NotebookPen,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/firebase';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/pre-production', label: 'Pre-Production', icon: ClipboardList },
  { href: '/dashboard/production', label: 'Production', icon: Clapperboard },
  { href: '/dashboard/post-production', label: 'Post-Production', icon: Presentation },
  { href: '/dashboard/status', label: 'Status Logs', icon: Rss },
  { href: '/dashboard/documentation', label: 'Documentation', icon: DocumentationIcon },
  { href: '/dashboard/legal', label: 'Legal & Contracts', icon: Scale },
  { href: '/dashboard/business', label: 'Business', icon: AreaChart },
];

const profileMenuItem = { href: '/dashboard/profile', label: 'Profile', icon: User };

export function SidebarNav() {
  const pathname = usePathname();
  const { user } = useUser();

  const allMenuItems = user ? [...menuItems, profileMenuItem] : menuItems;

  return (
    <SidebarMenu>
      {allMenuItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href}>
            <SidebarMenuButton
              isActive={pathname === item.href}
              tooltip={item.label}
            >
              <item.icon />
              <span>{item.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
