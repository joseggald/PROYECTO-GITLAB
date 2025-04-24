import { createFileRoute } from "@tanstack/react-router";
import { RegisterForm } from "@/features/Register/components/RegisterForm";
import DefaultLayout from "@/layout/DefaultLayout/DefaultLayout";
import { createPublicGuard } from "@/utils/functions/guards/route.guard";

export const Route = createFileRoute("/register/")({
  component: RouteComponent,
  beforeLoad: createPublicGuard(),
});

function RouteComponent() {
  return (
    <DefaultLayout
      title="Registrarse"
      description="Crea una cuenta para comenzar a comprar tus libros favoritos."
    >
      <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div
          className="absolute inset-0 transition-all duration-1000 ease-out"
          style={{
            backgroundImage: 'url(/background4.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/80 via-gray-950/20 to-yellow-700/5 backdrop-blur-sm" />
        </div>

        <div className="relative z-10 w-full max-w-md animate-fade-up">
          <RegisterForm />
        </div>
      </div>
    </DefaultLayout>
  );
}