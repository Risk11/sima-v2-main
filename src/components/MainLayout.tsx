import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/app/dashboard/header";

export default function MainLayout() {
    return (
        <SidebarProvider
            className="font-poppins"
        >
            <AppSidebar />
            <SidebarInset className="flex flex-col h-screen bg-white">
                <Header />

                <main className="flex-grow overflow-y-auto">
                    <Outlet />
                </main>
            </SidebarInset>

        </SidebarProvider>
    );
}
