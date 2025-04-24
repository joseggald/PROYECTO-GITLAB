import React, { useState } from 'react';
import { Product } from '../types/comments.type';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CommentsDialog from './CommentsDialog';
import { useComments } from '../hooks/userComments';

interface ProductListProps {
  products: Product[];
}

export const ProductList: React.FC<ProductListProps> = ({ products }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { useCommentsByProductId } = useComments();
  const { data: comments = [] } = useCommentsByProductId(selectedProduct?.id_producto || 0);

  // Filtrar productos por nombre o categoría y que sean libros
  const filteredProducts = products.filter(
    (product) =>
      product.es_libro &&
      (product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.categoria.toLowerCase().includes(searchTerm.toLowerCase()))
  );

return (
    <div className="space-y-4">
        <Input
            placeholder="Buscar por nombre o categoría"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-md p-2"
        />
        <div className="max-h-96 overflow-y-auto">
            {filteredProducts.map((product) => (
                <Card
                    key={product.id_producto}
                    className="p-4 flex justify-between items-center mb-2 bg-gradient-to-r from-yellow-100 to-yellow-300 shadow-md rounded-lg"
                >
                    <div>
                        <h3 className="font-semibold text-gray-800">{product.nombre}</h3>
                        <p className="text-gray-600">Categoría: {product.categoria}</p>
                    </div>
                    <Button
                        onClick={() => setSelectedProduct(product)}
                        className="bg-yellow-400 text-gray-800 rounded-md px-4 py-2 hover:bg-yellow-500"
                    >
                        Ver Comentarios
                    </Button>
                </Card>
            ))}
        </div>
        {selectedProduct && (
            <CommentsDialog
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
                product={{
                    nombre: selectedProduct.nombre,
                    autor: selectedProduct.autor || 'Desconocido',
                    fecha_lanzamiento: selectedProduct.fecha_lanzamiento || 'No disponible',
                }}
                comments={comments}
            />
        )}
    </div>
);
};

export default ProductList;