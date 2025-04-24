import { Button } from "@/components/ui/button";
import DefaultLayout from "@/layout/DefaultLayout/DefaultLayout";
import { Link } from "@tanstack/react-router";

export const ServerError = () => {
  return (
    <DefaultLayout
      title="500 - Error del servidor"
      description="¡Ups! Algo salió mal, intenta nuevamente más tarde"
    >
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">500</h1>
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">
            Error Interno del Servidor
          </h2>
          <p className="text-gray-500 mb-8">
            ¡Ups! Algo salió mal, intenta nuevamente más tarde
          </p>
          <Link to="/">
            <Button>Regresar</Button>
          </Link>
        </div>
      </div>
    </DefaultLayout>
  );
};
