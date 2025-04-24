import { Button } from "@/components/ui/button";
import DefaultLayout from "@/layout/DefaultLayout/DefaultLayout";
import { Link } from "@tanstack/react-router";

export const NotFound = () => {
  return (
    <DefaultLayout
      title="404 - Página no encontrada"
      description="La página que estás buscando no existe o ha sido movida."
    >
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">
            Página no encontrada
          </h2>
          <p className="text-gray-500 mb-8">
            La página que estás buscando no existe o ha sido movida.
          </p>
          <Link to="/">
            <Button>Regresar</Button>
          </Link>
        </div>
      </div>
    </DefaultLayout>
  );
};
