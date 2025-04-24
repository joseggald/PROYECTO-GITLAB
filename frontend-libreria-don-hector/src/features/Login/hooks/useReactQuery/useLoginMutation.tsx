import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "@/hooks/Toast/use-toast";
import { authService } from "@/services/auth/auth.service";
import { LoginCredentials, UserRole } from "@/types/auth.types";
import { isAxiosError } from "axios";

export const useLoginMutation = () => {
  const navigate = useNavigate();
  
  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    
    onSuccess: (user) => {
      toast({
        title: "¡Bienvenido!",
        description: "Has iniciado sesión exitosamente",
        variant: "default",
      });
      
      const redirectMap: Record<UserRole, string> = {
        [UserRole.GERENTE]: '/dashboard/admin/supervisores',
        [UserRole.SUPERVISOR]: '/dashboard/gestion/empleados',
        [UserRole.EMPLEADO]: '/dashboard/ventas/productos',
        [UserRole.CLIENTE]: '/tienda/libros',
      };
      
      setTimeout(() => {
        navigate({ to: redirectMap[user.role as UserRole] || '/' });
      }, 500);
    },
    
    onError: (error) => {
      if (isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 
                           "Ha ocurrido un error durante el inicio de sesión.";
        
        toast({
          title: "Error de inicio de sesión",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Error",
        description: "Ocurrió un error al iniciar sesión",
        variant: "destructive",
      });
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  
  const logout = () => {
    authService.logout();
    
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente.",
      variant: "default",
    });
    
    setTimeout(() => {
      navigate({ to: '/login' });
    }, 300);
  };
  
  return { logout };
};