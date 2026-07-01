import Sidebar from "@/components/layout/sidebar";
import Topbar from "@/components/layout/topbar";

import ProtectedRoute from "@/components/auth/protected-route";
import AuthHydrator from "@/components/auth/auth-hydrator";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <AuthHydrator />

            <ProtectedRoute>
                <div className="min-h-screen bg-[#fafafa] dark:bg-[#09090b]">
                    <div className="flex">
                        {/* SIDEBAR */}
                        <div className="hidden lg:block">
                            <Sidebar />
                        </div>

                        {/* CONTENT */}
                        <div className="flex-1 min-w-0 flex flex-col">
                            <Topbar />

                            <main
                                className="
                                    flex-1
                                    px-4
                                    md:px-6
                                    xl:px-8
                                    py-6
                                    overflow-x-hidden
                                "
                            >
                                <div className="mx-auto max-w-[1700px]">
                                    {children}
                                </div>
                            </main>
                        </div>
                    </div>
                </div>
            </ProtectedRoute>
        </>
    );
}
