import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useLoginForm } from "../hooks";
import { LoadingOverlay } from "@/components/Loader/Loader";
import React, { useState, useEffect } from "react";
import { User, Lock, Book, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { form, onSubmit, isLoading } = useLoginForm();
  
  // Estado para la animación de texto
  const [subtitleIndex, setSubtitleIndex] = useState<number>(0);
  const [isTyping, setIsTyping] = useState<boolean>(true);
  const [currentText, setCurrentText] = useState<string>("");
  const [lastLoginError] = useState<string | null>(null);

  const subtitles: string[] = React.useMemo(
    () => [
      "Descubre mundos entre páginas",
      "Explora nuestro catálogo digital",
      "Tu próxima lectura te espera",
      "Literatura a un clic de distancia",
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
        // Cuando termina de escribir, espera 4 segundos antes de cambiar isTyping a false
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
      <div className="flex flex-col items-center mb-6">
        <div className="flex items-center">
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
                <h2 className="text-2xl font-bold text-white">Inicia sesión en tu cuenta</h2>
                <p className="text-balance text-sm text-gray-300">
                  Ingresa tus credenciales de usuario para acceder a tu cuenta.
                </p>
              </div>
              
              {lastLoginError && (
                <Alert variant="destructive" className="bg-red-900/60 border-red-700 text-white">
                  <AlertDescription>
                    {lastLoginError}
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="flex flex-col gap-6">
                <FormField
                  control={form.control}
                  name="correo_electronico"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-gray-200">
                        <User className="h-4 w-4 text-white" />
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
                            autoComplete="current-password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-300" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="rememberMe"
                    render={({ field }) => (
                      <FormItem className="flex flex-row space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            className="border-white data-[state=checked]:bg-yellow-700 data-[state=checked]:border-yellow-700"
                            name="rememberMe"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-gray-300">Recuérdame</FormLabel>
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
                      Iniciando sesión...
                    </span>
                  ) : (
                    <span>Iniciar sesión</span>
                  )}
                </Button>
                
                <div className="text-center text-sm text-gray-300">
                  <span>¿No tienes una cuenta aquí? </span>
                  <Link to="/register" className="text-yellow-500 hover:text-yellow-400 transition-colors">
                    Registrarse
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