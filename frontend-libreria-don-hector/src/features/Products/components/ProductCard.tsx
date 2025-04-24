import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Product } from '../types/products.types';
import { Eye, Edit, Trash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onView,
  onEdit,
  onDelete,
}) => {
return (
    <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 border border-gray-200 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-900/10 bg-white group">
        <CardContent className="flex-grow flex flex-col gap-2 p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                    <div className="bg-blue-100 p-2 rounded-full">
                        <span className="text-blue-700 font-semibold">P</span>
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-800 transition-colors duration-300">
                        {product.nombre}
                    </h3>
                </div>
                
                {product.stock <= product.stock_minimo && (
                    <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200 mt-2 sm:mt-0">
                        Bajo Stock
                    </Badge>
                )}
            </div>
            
            <div className="space-y-2 mt-2">
                <div className="flex flex-col sm:flex-row items-start sm:items-center text-sm text-gray-600">
                    <span className="inline-block w-24 text-gray-500">Código:</span>
                    <span className="font-medium">{product.codigo_producto}</span>
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center text-sm text-gray-600">
                    <span className="inline-block w-24 text-gray-500">Precio:</span>
                    <span className="font-medium">${product.precio_venta}</span>
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center text-sm text-gray-600">
                    <span className="inline-block w-24 text-gray-500">Stock:</span>
                    <span className="font-medium">{product.stock}</span>
                </div>
            </div>
        </CardContent>
        
        <CardFooter className="p-3 border-t border-gray-100 bg-gray-50">
            <div className="flex flex-col sm:flex-row gap-2 w-full">
                <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 border-blue-600 text-blue-700 hover:bg-blue-700 hover:text-white"
                    onClick={() => onView(product)}
                >
                    <Eye className="h-4 w-4 mr-1" />
                    <span>Ver</span>
                </Button>
                
                <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 border-green-600 text-green-700 hover:bg-green-700 hover:text-white"
                    onClick={() => onEdit(product)}
                >
                    <Edit className="h-4 w-4 mr-1" />
                    <span>Editar</span>
                </Button>
                
                <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 border-red-600 text-red-700 hover:bg-red-700 hover:text-white"
                    onClick={() => onDelete(product)}
                >
                    <Trash className="h-4 w-4 mr-1" />
                    <span>Borrar</span>
                </Button>
            </div>
        </CardFooter>
    </Card>
);
};

export default ProductCard;