import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRegisterForm } from "../hooks/useRegisterForm";
import { LoadingOverlay } from "@/components/Loader/Loader";
import React, { useState, useEffect } from "react";
import { Lock, Book, Mail, User, Hash, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { form, onSubmit, isLoading } = useRegisterForm();
  
  const [subtitleIndex, setSubtitleIndex] = useState<number>(0);
  const [isTyping, setIsTyping] = useState<boolean>(true);
  const [currentText, setCurrentText] = useState<string>("");

  const subtitles: string[] = React.useMemo(
    () => [
      "Únete a nuestra comunidad",
      "Comienza tu aventura literaria",
      "Un mundo de conocimiento te espera",
      "Crea tu biblioteca personal",
    ],
    []
  );

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    if (isTyping) {
      if (currentText.length < subtitles[subtitleIndex].length) {
        timer = setTimeout(() => {
          setCurrentText(
            subtitles[subtitleIndex].slice(0, currentText.length + 1)
          );
        }, 100);
      } else {
        timer = setTimeout(() => {
          setIsTyping(false);
        }, 4000);
      }
    } else {
      if (currentText.length > 0) {
        timer = setTimeout(() => {
          setCurrentText(currentText.slice(0, currentText.length - 1));
        }, 100);
      } else {
        setSubtitleIndex((subtitleIndex + 1) % subtitles.length);
        setIsTyping(true);
      }
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [currentText, isTyping, subtitleIndex, subtitles]);
  
  return (
    <>
      <div className="flex flex-col items-center gap-1 mb-6">
        <div className="flex items-center gap-2">
          <Book className="h-12 w-12 text-yellow-500" />
          <h1 className="text-4xl font-bold text-white">Librería Don Hector</h1>
        </div>
        <div className="h-6 text-center text-gray-300">
          <span>{currentText}</span>
          <span className={isTyping ? "animate-blink" : "opacity-0"}>|</span>
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className={cn("flex flex-col gap-6 rounded-xl bg-gray-900/60 p-8 backdrop-blur-lg", className)} {...props}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-2 text-center">
                <h2 className="text-2xl font-bold text-white">Crea tu cuenta</h2>
                <p className="text-balance text-sm text-gray-300">
                  Regístrate para acceder a nuestra tienda y comprar tus libros favoritos.
                </p>
              </div>
              <div className="flex flex-col gap-6">
                <FormField
                  control={form.control}
                  name="correo_electronico"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-gray-200">
                        <Mail className="h-4 w-4 text-white" />
                        <span>Correo Electrónico</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="border-gray-700 bg-white/10 text-white placeholder:text-gray-400 transition-all duration-200"
                          placeholder="Ingresa tu correo electrónico"
                          autoComplete="email"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-300" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nombre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-gray-200">
                        <User className="h-4 w-4 text-white" />
                        <span>Nombre</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="border-gray-700 bg-white/10 text-white placeholder:text-gray-400 transition-all duration-200"
                          placeholder="Ingresa tu nombre"
                          autoComplete="given-name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-300" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="apellido"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-gray-200">
                        <User className="h-4 w-4 text-white" />
                        <span>Apellido</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="border-gray-700 bg-white/10 text-white placeholder:text-gray-400 transition-all duration-200"
                          placeholder="Ingresa tu apellido"
                          autoComplete="family-name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-300" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="edad"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-gray-200">
                        <Hash className="h-4 w-4 text-white" />
                        <span>Edad</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="border-gray-700 bg-white/10 text-white placeholder:text-gray-400 transition-all duration-200"
                          placeholder="Ingresa tu edad"
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || '')}
                        />
                      </FormControl>
                      <FormMessage className="text-red-300" />
                    </FormItem>
                  )}
                />
                
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="contrasena"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-gray-200">
                          <Lock className="h-4 w-4 text-white" />
                          <span>Contraseña</span>
                        </FormLabel>
                        <FormControl>
                          <PasswordInput
                            className="border-gray-700 bg-white/10 text-white placeholder:text-gray-400 transition-all duration-200"
                            placeholder="Crea tu contraseña"
                            autoComplete="new-password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-300" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="confirmarContrasena"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-gray-200">
                          <Lock className="h-4 w-4 text-white" />
                          <span>Confirmar Contraseña</span>
                        </FormLabel>
                        <FormControl>
                          <PasswordInput
                            className="border-gray-700 bg-white/10 text-white placeholder:text-gray-400 transition-all duration-200"
                            placeholder="Confirma tu contraseña"
                            autoComplete="new-password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-300" />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-yellow-700 text-white transition-all duration-200 hover:bg-yellow-900 hover:shadow-sm" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                      Registrando...
                    </span>
                  ) : (
                    <span>Crear Cuenta</span>
                  )}
                </Button>
                
                <div className="text-center text-sm text-gray-300">
                  <span>¿Ya tienes una cuenta? </span>
                  <Link to="/login" className="text-yellow-500 hover:text-yellow-400 transition-colors">
                    Iniciar sesión
                  </Link>
                </div>
              </div>
            </div>
          </div>
          {isLoading && <LoadingOverlay />}
        </form>
      </Form>
      
      <div className="mt-4 flex flex-row rounded-xl bg-gray-900/60 p-2 backdrop-blur-lg">
        <div className="flex-1 border-r border-gray-700">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-300 hover:text-yellow-700 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Página principal</span>
          </Link>
        </div>
        
        <div className="flex-1 pl-4 flex justify-end">
          <Link
            to="/productos"
            className="inline-flex items-center gap-2 text-gray-300 hover:text-yellow-700 transition-colors"
          >
            <span>Ver productos</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
      
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 1s infinite;
        }
      `}</style>
    </>
  );
}

export default RegisterForm;