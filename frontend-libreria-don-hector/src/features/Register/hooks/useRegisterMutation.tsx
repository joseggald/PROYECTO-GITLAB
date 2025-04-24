import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "@/hooks/Toast/use-toast";
import { registerService } from "../services/register.service";
import { RegisterCredentials } from "../types/register.types";
import { isAxiosError } from "axios";

export const useRegisterMutation = () => {
  const navigate = useNavigate();
  
  return useMutation({
    mutationFn: (credentials: RegisterCredentials) => registerService.register(credentials),
    onSuccess: () => {
      toast({
        title: "¡Registro exitoso!",
        description: "Tu cuenta ha sido creada correctamente. Ya puedes iniciar sesión.",
        variant: "default",
      });
      
      // Redirigir al login después de 1.5 segundos para que vea el mensaje
      setTimeout(() => {
        navigate({ to: '/login' });
      }, 1500);
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        // Mensajes de error más específicos basados en la respuesta del servidor
        const errorMessage = error.response?.data?.message || 
                           "Ha ocurrido un error durante el registro.";
        
        // Detectar si es un error de correo ya existente
        const isEmailExistsError = errorMessage.includes("correo electronico") ||
                                 errorMessage.includes("email");
        
        toast({
          title: isEmailExistsError ? "Correo electrónico ya registrado" : "Error al registrarse",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Error",
        description: "Ocurrió un error al crear tu cuenta. Por favor, intenta nuevamente.",
        variant: "destructive",
      });
    },
  });
};

export default useRegisterMutation;