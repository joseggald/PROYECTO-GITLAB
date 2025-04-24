import { ReactNode } from "react";
import { useAuthStore } from "@/store/auth/auth.store";
import { UserRole } from "@/types/auth.types";

interface RoleBasedComponentProps {
  roles: UserRole[];
  children: ReactNode;
  fallback?: ReactNode;
}

export const RoleBasedComponent = ({ 
  roles, 
  children, 
  fallback = null 
}: RoleBasedComponentProps) => {
  const hasRole = useAuthStore(state => state.hasRole);
  
  if (hasRole(roles)) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
};
