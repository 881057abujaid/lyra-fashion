import { requireAdmin } from "@/lib/auth/authorization";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default async function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    await requireAdmin();

    return (
        <div className="min-h-screen bg-lyra-cream">
            <div className="flex min-h-screen">
                <AdminSidebar />

                <div className="flex min-w-0 flex-1 flex-col">
                    <AdminHeader />

                    <main className="flex-1">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}