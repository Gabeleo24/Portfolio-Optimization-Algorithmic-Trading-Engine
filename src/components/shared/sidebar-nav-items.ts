import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, BrainCircuit, ShieldCheck, LineChart } from 'lucide-react';

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
}

export const navItems: NavItem[] = [
  {
    href: '/',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/ai-visualizations',
    label: 'AI Visualizations',
    icon: BrainCircuit,
  },
  {
    href: '/risk-analytics',
    label: 'Risk Analytics',
    icon: ShieldCheck,
  },
  {
    href: '/real-time-data',
    label: 'Real-Time Data',
    icon: LineChart,
  },
];
