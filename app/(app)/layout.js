"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { AIChatPanel } from "@/components/ai/ai-chat-panel";
import { PageTransition } from "@/components/layout/page-transition";

export default function AppShell({ children }) {
  return (
    <div className="min-h-dvh bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>
      <Sidebar />
      <div className="lg:pl-[268px]">
        <Topbar />
        <main id="main-content" className="mx-auto w-full max-w-[1200px] px-4 pb-28 pt-6 sm:px-6 lg:pb-12">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
      <BottomNav />
      <AIChatPanel />
    </div>
  );
}
