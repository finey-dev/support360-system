
import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

export const DashboardLayout = ({ children, showSidebar = true }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex">
      {showSidebar && <Sidebar />}
      <div className={`flex-1 ${showSidebar ? 'lg:ml-64' : ''}`}>
        <main className="p-4 md:p-6 max-w-7xl mx-auto">{children}</main>
      </div>
    </div>
  );
};
