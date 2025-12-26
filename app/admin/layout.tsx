// app/admin/layout.tsx

import AuthGuard from "@/context/AuthGuard";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="flex">
                    {/* Sidebar would go here */}
                    <main className="flex-1">
                        {children}
                    </main>
                </div>
            </div>
        </AuthGuard>
    );
}