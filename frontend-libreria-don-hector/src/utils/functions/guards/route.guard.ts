import { redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/store/auth/auth.store";
import { UserRole } from "@/types/auth.types";

interface GuardOptions {
  roles?: UserRole[];
  redirectTo?: string;
}

export const createGuard = (options: GuardOptions = {}) => {
  const { roles = [], redirectTo = "/login" } = options;
  
  return async () => {
    const { isAuthenticated, user, hasRole } = useAuthStore.getState();
    
    if (!isAuthenticated || !user) {
      throw redirect({
        to: redirectTo,
        search: { 
          returnTo: window.location.pathname,
        },
      });
    }
    
    if (roles.length > 0 && !hasRole(roles)) {
      throw redirect({
        to: "/unauthorized",
      });
    }
    
    return { user };
  };
};

export const createPublicGuard = (options: { redirectTo?: string } = {}) => {
  const { redirectTo } = options;
  
  return async () => {
    const { isAuthenticated, user } = useAuthStore.getState();
    
    if (isAuthenticated && user) {
      const roleRedirects: Record<UserRole, string> = {
        [UserRole.GERENTE]: '/dashboard/admin/supervisores',
        [UserRole.SUPERVISOR]: '/dashboard/gestion/empleados',
        [UserRole.EMPLEADO]: '/dashboard/ventas/productos',
        [UserRole.CLIENTE]: '/tienda/libros',
      };
      
      let targetRedirect
      if (redirectTo) {
        targetRedirect = redirectTo
      } else {
        targetRedirect = roleRedirects[user.role] || '/';
      }
      
      throw redirect({
        to: targetRedirect,
      });
    }
    
    return {};
  };
};