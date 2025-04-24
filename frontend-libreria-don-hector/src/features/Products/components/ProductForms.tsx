import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Product, ProductFormData, UpdateProductData } from '../types/products.types';

// Dialog para crear un nuevo producto
export const CreateProductDialog: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: ProductFormData) => void;
    isSubmitting: boolean;
}> = ({ isOpen, onClose, onSubmit, isSubmitting }) => {
    const [formData, setFormData] = useState<ProductFormData>({
        nombre: '',
        descripcion: '',
        codigo_producto: '',
        categoria: '',
        precio_compra: 0,
        precio_venta: 0,
        stock: 0,
        imagen: '',
        es_libro: false,
        autor: null,
        fecha_lanzamiento: null,
        stock_minimo: 5,
    });

    useEffect(() => {
        if (isOpen) {
            setFormData({
                nombre: '',
                descripcion: '',
                codigo_producto: '',
                categoria: '',
                precio_compra: 0,
                precio_venta: 0,
                stock: 0,
                imagen: '',
                es_libro: false,
                autor: null,
                fecha_lanzamiento: null,
                stock_minimo: 5,
            });
        }
    }, [isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'precio_compra' || name === 'precio_venta' || name === 'stock'
                ? (value ? parseFloat(value) : 0)
                : value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                imagen: URL.createObjectURL(file)
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md max-h-screen overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Crear Nuevo Producto</DialogTitle>
                    <DialogDescription>
                        Complete el formulario para crear un nuevo producto
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="nombre">Nombre</Label>
                            <Input
                                id="nombre"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="descripcion">Descripción</Label>
                            <Textarea
                                id="descripcion"
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="codigo_producto">Código</Label>
                            <Input
                                id="codigo_producto"
                                name="codigo_producto"
                                value={formData.codigo_producto}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="categoria">Categoría</Label>
                            <Input
                                id="categoria"
                                name="categoria"
                                value={formData.categoria}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="precio_compra">Precio de Compra</Label>
                            <Input
                                id="precio_compra"
                                name="precio_compra"
                                type="number"
                                value={formData.precio_compra}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="precio_venta">Precio de Venta</Label>
                            <Input
                                id="precio_venta"
                                name="precio_venta"
                                type="number"
                                value={formData.precio_venta}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="stock">Stock</Label>
                            <Input
                                id="stock"
                                name="stock"
                                type="number"
                                value={formData.stock}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="imagen">Imagen</Label>
                            <Input
                                id="imagen"
                                name="imagen"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="es_libro">Es un libro</Label>
                        <div className="flex items-center space-x-4">
                            <Button
                                type="button"
                                variant={formData.es_libro ? "default" : "outline"}
                                onClick={() => setFormData(prev => ({ ...prev, es_libro: true }))}
                            >
                                Sí
                            </Button>
                            <Button
                                type="button"
                                variant={!formData.es_libro ? "default" : "outline"}
                                onClick={() => setFormData(prev => ({ ...prev, es_libro: false }))}
                            >
                                No
                            </Button>
                        </div>
                    </div>

                    {formData.es_libro && (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="autor">Autor</Label>
                                <Input
                                    id="autor"
                                    name="autor"
                                    type="text"
                                    value={formData.autor || ''}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="fecha_lanzamiento">Fecha de Lanzamiento</Label>
                                <Input
                                    id="fecha_lanzamiento"
                                    name="fecha_lanzamiento"
                                    type="date"
                                    value={formData.fecha_lanzamiento || ''}
                                    onChange={handleChange}
                                />
                            </div>
                        </>
                    )}

                    <DialogFooter className="mt-6">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                                    Guardando...
                                </>
                            ) : (
                                'Guardar Producto'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

// Dialog para actualizar un producto
export const UpdateProductDialog: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
    onSubmit: (data: UpdateProductData) => void;
    isSubmitting: boolean;
}> = ({ isOpen, onClose, product, onSubmit, isSubmitting }) => {
    const [formData, setFormData] = useState<UpdateProductData>({
        id_producto: 0,
        nombre: '',
        descripcion: '',
        codigo_producto: '',
        categoria: '',
        precio_compra: 0,
        precio_venta: 0,
        stock: 0,
        imagen: '',
        es_libro: false,
        autor: null,
        fecha_lanzamiento: null,
        stock_minimo: 0,
    });

    useEffect(() => {
        if (product) {
            setFormData({
                id_producto: product.id_producto,
                nombre: product.nombre,
                descripcion: product.descripcion,
                codigo_producto: product.codigo_producto || '',
                categoria: product.categoria || '',
                precio_compra: product.precio_compra || 0,
                precio_venta: product.precio_venta,
                stock: product.stock,
                imagen: product.imagen || '',
                es_libro: product.es_libro || false,
                autor: product.autor || null,
                fecha_lanzamiento: product.fecha_lanzamiento || null,
                stock_minimo: product.stock_minimo,
            });
        }
    }, [product]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'precio_compra' || name === 'precio_venta' || name === 'stock'
                ? (value ? parseFloat(value) : 0)
                : value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                imagen: URL.createObjectURL(file)
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (product) {
            onSubmit(formData);
        }
    };

    if (!product) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md max-h-screen overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Actualizar Producto</DialogTitle>
                    <DialogDescription>
                        Actualice la información del producto
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="nombre">Nombre</Label>
                            <Input
                                id="nombre"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="descripcion">Descripción</Label>
                            <Textarea
                                id="descripcion"
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="codigo_producto">Código</Label>
                            <Input
                                id="codigo_producto"
                                name="codigo_producto"
                                value={formData.codigo_producto}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="categoria">Categoría</Label>
                            <Input
                                id="categoria"
                                name="categoria"
                                value={formData.categoria}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="precio_compra">Precio de Compra (Q)</Label>
                            <Input
                                id="precio_compra"
                                name="precio_compra"
                                type="number"
                                value={formData.precio_compra}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="precio_venta">Precio de Venta (Q)</Label>
                            <Input
                                id="precio_venta"
                                name="precio_venta"
                                type="number"
                                value={formData.precio_venta}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="stock">Stock</Label>
                            <Input
                                id="stock"
                                name="stock"
                                type="number"
                                value={formData.stock}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="imagen">Imagen</Label>
                            <Input
                                id="imagen"
                                name="imagen"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="es_libro">Es un libro</Label>
                        <div className="flex items-center space-x-4">
                            <Button
                                type="button"
                                variant={formData.es_libro ? "default" : "outline"}
                                onClick={() => setFormData(prev => ({ ...prev, es_libro: true }))}
                            >
                                Sí
                            </Button>
                            <Button
                                type="button"
                                variant={!formData.es_libro ? "default" : "outline"}
                                onClick={() => setFormData(prev => ({ ...prev, es_libro: false }))}
                            >
                                No
                            </Button>
                        </div>
                    </div>

                    {formData.es_libro && (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="autor">Autor</Label>
                                <Input
                                    id="autor"
                                    name="autor"
                                    type="text"
                                    value={formData.autor || ''}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="fecha_lanzamiento">Fecha de Lanzamiento</Label>
                                <Input
                                    id="fecha_lanzamiento"
                                    name="fecha_lanzamiento"
                                    type="date"
                                    value={formData.fecha_lanzamiento || ''}
                                    onChange={handleChange}
                                />
                            </div>
                        </>
                    )}

                    <DialogFooter className="mt-6">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                                    Actualizando...
                                </>
                            ) : (
                                'Actualizar Producto'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

// Dialog para eliminar un producto
export const DeleteProductDialog: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
    onSubmit: (id: string) => void;
    isSubmitting: boolean;
}> = ({ isOpen, onClose, product, onSubmit, isSubmitting }) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (product) {
            onSubmit(product.id_producto.toString());
        }
    };

    if (!product) return null;

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Eliminar Producto</AlertDialogTitle>
                    <AlertDialogDescription>
                        ¿Estás seguro de que deseas eliminar el producto {product.nombre}?
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    <AlertDialogFooter className="mt-6">
                        <AlertDialogCancel disabled={isSubmitting}>Cancelar</AlertDialogCancel>
                        <Button type="submit" variant="destructive">
                            {isSubmitting ? (
                                <>
                                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                                    Eliminando...
                                </>
                            ) : (
                                'Eliminar Producto'
                            )}
                        </Button>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
};

// Dialog para ver detalles de un producto
export const ProductDetailsDialog: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
}> = ({ isOpen, onClose, product }) => {
    if (!product) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Detalles del Producto</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="flex items-center justify-center mb-4">
                        <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-700 font-semibold">P</span>
                        </div>
                    </div>

                    <h3 className="text-center text-xl font-bold text-gray-900">
                        {product.nombre}
                    </h3>

                    <div className="grid grid-cols-1 gap-4 pt-4">
                        <div className="flex items-start">
                            <div className="w-1/3">
                                <span className="text-gray-500">Código:</span>
                            </div>
                            <div className="w-2/3">
                                <p className="text-base text-gray-900">{product.codigo_producto}</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="w-1/3">
                                <span className="text-gray-500">Precio:</span>
                            </div>
                            <div className="w-2/3">
                                <p className="text-base text-gray-900">Q{product.precio_venta}</p>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <div className="w-1/3">
                                <span className="text-gray-500">Stock:</span>
                            </div>
                            <div className="w-2/3">
                                <p className="text-base text-gray-900">{product.stock}</p>
                            </div>
                        </div>

                        {product.es_libro && (
                            <div className="flex items-start">
                                <div className="w-1/3">
                                    <span className="text-gray-500">Autor:</span>
                                </div>
                                <div className="w-2/3">
                                    <p className="text-base text-gray-900">{product.autor}</p>
                                </div>
                            </div>
                        )}

                        {product.es_libro && (
                            <div className="flex items-start">
                                <div className="w-1/3">
                                    <span className="text-gray-500">Fecha de Lanzamiento:</span>
                                </div>
                                <div className="w-2/3">
                                    <p className="text-base text-gray-900">{product.fecha_lanzamiento}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={onClose} className="w-full">
                        Cerrar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};