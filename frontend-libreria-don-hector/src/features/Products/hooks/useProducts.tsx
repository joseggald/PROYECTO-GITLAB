import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../services/product.service';
import { Product, ProductFormData, UpdateProductData } from '../types/products.types';
import { toast } from '@/hooks/Toast/use-toast';

export const PRODUCTS_QUERY_KEYS = {
  all: ['products'] as const,
};

export const useProducts = () => {
  const queryClient = useQueryClient();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  // Query para obtener todos los productos
  const { 
    data: products = [],
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: PRODUCTS_QUERY_KEYS.all,
    queryFn: productService.getAllProducts,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Mutación para crear producto
  const createMutation = useMutation({
    mutationFn: (newProduct: ProductFormData) => 
      productService.createProduct(newProduct),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEYS.all });
      setIsCreateDialogOpen(false);
      toast({
        title: "Producto creado",
        description: "El producto ha sido creado exitosamente.",
        variant: "default",
      });
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "No se pudo crear el producto.",
        variant: "destructive",
      });
    }
  });

  // Mutación para actualizar producto
  const updateMutation = useMutation({
    mutationFn: (updateData: UpdateProductData) => 
      productService.updateProduct(updateData.id_producto?.toString() || '', updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEYS.all });
      setIsUpdateDialogOpen(false);
      toast({
        title: "Producto actualizado",
        description: "El producto ha sido actualizado exitosamente.",
        variant: "default",
      });
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "No se pudo actualizar el producto.",
        variant: "destructive",
      });
    }
  });

  // Mutación para eliminar producto
  const deleteMutation = useMutation({
    mutationFn: (id: string) => 
      productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEYS.all });
      setIsDeleteDialogOpen(false);
      toast({
        title: "Producto eliminado",
        description: "El producto ha sido eliminado exitosamente.",
        variant: "default",
      });
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "No se pudo eliminar el producto.",
        variant: "destructive",
      });
    }
  });

  // Handlers para dialogs
  const openCreateDialog = () => setIsCreateDialogOpen(true);
  const closeCreateDialog = () => setIsCreateDialogOpen(false);

  const openUpdateDialog = (product: Product) => {
    setSelectedProduct(product);
    setIsUpdateDialogOpen(true);
  };
  const closeUpdateDialog = () => {
    setIsUpdateDialogOpen(false);
    setSelectedProduct(null);
  };

  const openDeleteDialog = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };
  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedProduct(null);
  };

  const openDetailsDialog = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailsDialogOpen(true);
  };
  const closeDetailsDialog = () => {
    setIsDetailsDialogOpen(false);
    setSelectedProduct(null);
  };

  // Handlers para operaciones
  const createProduct = (productData: ProductFormData) => {
    createMutation.mutate(productData);
  };

  const updateProduct = (updateData: UpdateProductData) => {
    updateMutation.mutate(updateData);
  };

  const deleteProduct = (id: string) => {
    deleteMutation.mutate(id);
  };

  return {
    products,
    selectedProduct,
    isLoading,
    isError,
    error,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    
    // Dialog states
    isCreateDialogOpen,
    isUpdateDialogOpen,
    isDeleteDialogOpen,
    isDetailsDialogOpen,
    
    // Dialog handlers
    openCreateDialog,
    closeCreateDialog,
    openUpdateDialog,
    closeUpdateDialog,
    openDeleteDialog,
    closeDeleteDialog,
    openDetailsDialog,
    closeDetailsDialog,
    
    // Operations
    createProduct,
    updateProduct,
    deleteProduct,
    refetch,
  };
};

export default useProducts;