import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRegisterMutation } from "./useRegisterMutation";
import { RegisterFormData } from "../types/register.types";

// El enum refleja los roles de la base de datos
export enum UserRole {
  GERENTE = 1,
  SUPERVISOR = 2,
  EMPLEADO = 3,
  CLIENTE = 4
}

export function useRegisterForm(rolId = UserRole.CLIENTE) {
  const registerMutation = useRegisterMutation();

  const baseSchema = {
    correo_electronico: z.string().email({
      message: "El correo electrónico debe tener un formato válido.",
    }).nonempty({
      message: "El correo electrónico es obligatorio.",
    }),
    nombre: z.string().min(2, {
      message: "El nombre debe tener al menos 2 caracteres.",
    }).nonempty({
      message: "El nombre es obligatorio.",
    }),
    apellido: z.string().min(2, {
      message: "El apellido debe tener al menos 2 caracteres.",
    }).nonempty({
      message: "El apellido es obligatorio.",
    }),
    edad: z.number().min(18, {
      message: "Debes ser mayor de 18 años.",
    }).or(z.string().regex(/^\d+$/).transform(Number)).refine(val => val >= 18, {
      message: "Debes ser mayor de 18 años.",
    }),
    contrasena: z.string().min(6, {
      message: "La contraseña debe tener al menos 6 caracteres.",
    }).nonempty({
      message: "La contraseña es obligatoria.",
    }),
    confirmarContrasena: z.string().nonempty({
      message: "Debes confirmar tu contraseña.",
    }),
  };

  const formSchema = z.object({
    ...baseSchema
  }).refine((data) => data.contrasena === data.confirmarContrasena, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmarContrasena"],
  });

  const defaultValues: Partial<RegisterFormData> = {
    correo_electronico: "",
    nombre: "",
    apellido: "",
    edad: 18,
    contrasena: "",
    confirmarContrasena: ""
  };
  
  if (rolId === UserRole.EMPLEADO || rolId === UserRole.SUPERVISOR) {
    defaultValues.cui = "";
    defaultValues.genero = "";
    defaultValues.telefono = "";
  }

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  async function onSubmit(values: RegisterFormData) {
    await registerMutation.mutate({
      ...values,
      id_rol: rolId
    });
  }

  return {
    form,
    onSubmit,
    isLoading: registerMutation.isPending,
  };
}

export default useRegisterForm;