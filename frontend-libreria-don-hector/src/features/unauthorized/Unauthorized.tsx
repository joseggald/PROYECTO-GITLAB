import { Button } from "@/components/ui/button";
import DefaultLayout from "@/layout/DefaultLayout/DefaultLayout";
import { Link } from "@tanstack/react-router";

export const Unauthorized = () => {
  return (
    <DefaultLayout
      title="401 - Acceso Restringido"
      description="No tienes permiso para acceder a esta página."
    >
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">401</h1>
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">
            Acceso no permitido.
          </h2>
          <p className="text-gray-500 mb-8">
            No tienes permiso para acceder a esta página.
          </p>
          <Link to="/login">
            <Button>Regresar</Button>
          </Link>
        </div>
      </div>
    </DefaultLayout>
  );
};
