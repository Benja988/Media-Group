// app/admin/layout.tsx
"use client";

import React, { useEffect, useState } from "react";
import clsx from "clsx";

import AuthGuard from "@/context/AuthGuard";
import AdminSidebar from "@/components/admin/AdminSidebar";
import TopNav from "@/components/admin/TopNav";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Top navigation */}
        <TopNav
          onMenuToggle={() => setSidebarOpen((prev) => !prev)}
          showMenuToggle={isMobile}
        />

        <div className="flex relative">
          {/* Sidebar */}
          <AdminSidebar
            className={clsx(
              "transition-transform duration-300 ease-in-out",
              isMobile &&
                !sidebarOpen &&
                "-translate-x-full lg:translate-x-0",
              isMobile &&
                sidebarOpen &&
                "fixed inset-y-0 left-0 z-50"
            )}
          />

          {/* Main content */}
          <main
            className={clsx(
              "flex-1 p-6 transition-all duration-300",
              isMobile ? "w-full" : "lg:ml-64"
            )}
          >
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
