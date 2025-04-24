// src/layouts/MainLayout.tsx
import { ReactNode } from "react";
import Header from "@/components/Dashboard/Header/Header";
import { useAuthStore } from "@/store/auth/auth.store";
import { UserRole } from "@/types/auth.types";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: MainLayoutProps) => {
  const { user } = useAuthStore();
  
  const needsSidebar = user && (
    user.role === UserRole.GERENTE || 
    user.role === UserRole.SUPERVISOR || 
    user.role === UserRole.EMPLEADO
  );
  
  const containerClasses = cn(
    "min-h-screen flex flex-col",
    {
      "bg-gray-50": needsSidebar,
      "bg-white": !needsSidebar || user?.role === UserRole.CLIENTE
    }
  );
  
  return (
    <div className={containerClasses}>
      <Header />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;