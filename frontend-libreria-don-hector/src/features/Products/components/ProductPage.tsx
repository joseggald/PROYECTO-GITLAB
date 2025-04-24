import React from 'react';
import { useProducts } from '../hooks/useProducts';
import ProductGrid from '../components/ProductGrid';
import { 
  CreateProductDialog,
  UpdateProductDialog,
  DeleteProductDialog,
  ProductDetailsDialog
} from '../components/ProductForms';
import { Card } from '@/components/ui/card';

const ProductPage: React.FC = () => {
  const {
    products,
    selectedProduct,
    isLoading,
    isError,
    isCreating,
    isUpdating,
    isDeleting,
    
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
  } = useProducts();

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Gestión de Productos</h1>
      
      <Card className="p-6">
        <ProductGrid
          products={products}
          isLoading={isLoading}
          isError={isError}
          onView={openDetailsDialog}
          onEdit={openUpdateDialog}
          onDelete={openDeleteDialog}
          onCreateNew={openCreateDialog}
        />
      </Card>
      
      {/* Dialogs */}
      <CreateProductDialog
        isOpen={isCreateDialogOpen}
        onClose={closeCreateDialog}
        onSubmit={createProduct}
        isSubmitting={isCreating}
      />
      
      <UpdateProductDialog
        isOpen={isUpdateDialogOpen}
        onClose={closeUpdateDialog}
        product={selectedProduct}
        onSubmit={updateProduct}
        isSubmitting={isUpdating}
      />
      
      <DeleteProductDialog
        isOpen={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        product={selectedProduct}
        onSubmit={deleteProduct}
        isSubmitting={isDeleting}
      />
      
      <ProductDetailsDialog
        isOpen={isDetailsDialogOpen}
        onClose={closeDetailsDialog}
        product={selectedProduct}
      />
    </div>
  );
};

export default ProductPage;