"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { NavItem } from '@/components/shared/sidebar-nav-items';
import { navItems } from '@/components/shared/sidebar-nav-items';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

export function NavLinks() {
  const pathname = usePathname();
  return (
    <SidebarMenu>
      {navItems.map((item: NavItem) => (
        <SidebarMenuItem key={item.label}>
          <SidebarMenuButton
            asChild
            isActive={pathname === item.href}
            tooltip={{ children: item.label, className: "bg-primary text-primary-foreground" }}
          >
            <Link href={item.href} className="flex items-center gap-2">
              <item.icon />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
