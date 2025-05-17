import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Link from 'next/link';

import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { QuantPulseLogo } from '@/components/icons/quant-pulse-logo';
import { UserDropdown } from '@/components/shared/user-dropdown';
import { NavLinks } from '@/components/shared/nav-links';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'QuantPulse',
    template: '%s | QuantPulse',
  },
  description: 'Portfolio Optimization & Algorithmic Trading Engine by QuantPulse.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SidebarProvider defaultOpen>
          <Sidebar collapsible="icon" variant="sidebar" className="border-r border-sidebar-border">
            <SidebarHeader className="p-4">
              <Link href="/" aria-label="QuantPulse Home">
                <div className="flex items-center gap-2">
                  <QuantPulseLogo className="h-8 w-8 text-sidebar-primary" />
                  <span className="text-xl font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
                    QuantPulse
                  </span>
                </div>
              </Link>
            </SidebarHeader>
            <SidebarContent className="p-2">
              <NavLinks />
            </SidebarContent>
            <SidebarFooter className="p-2">
               <div className="group-data-[collapsible=icon]:hidden">
                 <UserDropdown />
               </div>
               <div className="hidden group-data-[collapsible=icon]:block">
                  <UserDropdown />
               </div>
            </SidebarFooter>
          </Sidebar>
          <SidebarInset>
            <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6 md:hidden">
              <SidebarTrigger className="text-foreground"/>
              <Link href="/" aria-label="QuantPulse Home">
                <div className="flex items-center gap-2 font-semibold">
                  <QuantPulseLogo className="h-6 w-6 text-primary" />
                  <span className="sr-only">QuantPulse</span>
                </div>
              </Link>
              {/* Mobile header actions can go here if needed */}
            </header>
            <main className="flex-1 p-4 sm:p-6">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
