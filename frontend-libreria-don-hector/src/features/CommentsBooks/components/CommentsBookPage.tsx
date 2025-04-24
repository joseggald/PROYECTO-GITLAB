import React from 'react';
import { useComments } from '../hooks/userComments';
import { ProductList } from '../components/ProductList';
import { Card } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

const CommentsBooksPage: React.FC = () => {
  const { products, isLoadingProducts, isErrorProducts } = useComments();

  if (isLoadingProducts) {
    return <div>Cargando productos...</div>;
  }

  if (isErrorProducts) {
    return <div>Error al cargar los productos.</div>;
  }

return (
    <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-yellow-800 mb-6">Opiniones y Comentarios</h1>
        <Card className="p-6 bg-yellow-100">
            <div className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-yellow-600" />
                <h2 className="text-xl font-semibold text-yellow-800">Lista de Libros</h2>
            </div>
            <p className="text-yellow-700 mb-4">Selecciona un libro para ver sus comentarios.</p>
            <div className="max-h-96 overflow-y-auto">
                <ProductList products={products} />
            </div>
        </Card>
    </div>
);
};

export default CommentsBooksPage;