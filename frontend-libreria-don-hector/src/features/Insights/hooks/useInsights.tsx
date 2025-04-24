import { useState, useEffect } from 'react';
import insightsService, { TopRatedProduct } from '../services/insights.service';
import { toast } from '@/hooks/Toast/use-toast';

export interface CategoryStat {
  name: string;
  count: number;
}

export interface RatingStat {
  rating: number;
  count: number;
}

export interface UserStats {
  purchasedCount: number;
  wishlistCount: number;
}

export const useInsights = () => {
  const [topRatedProducts, setTopRatedProducts] = useState<TopRatedProduct[]>([]);
  const [userID, setUserID] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedBook, setSelectedBook] = useState<TopRatedProduct | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);


  const fetchInsights = async (showToast: boolean = false) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { idCliente, products } = await insightsService.getTopRatedProducts();
      setTopRatedProducts(products);
      setUserID(idCliente);
      
      if (showToast) {
        toast({
          title: "Datos actualizados",
          description: "La información se ha actualizado correctamente",
          variant: "default",
        });
      }
    } catch (err) {
      console.error('Error al cargar insights:', err);
      setError('No se pudieron cargar los datos. Por favor, intenta nuevamente más tarde.');
      
      if (showToast) {
        toast({
          title: "Error",
          description: "No se pudieron actualizar los datos. Intenta de nuevo más tarde.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const handleViewDetails = (book: TopRatedProduct) => {
    setSelectedBook(book);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
  };

  const getUserStats = () => {
    const purchasedCount = topRatedProducts.filter(product => product.comprado).length;
    const wishlistCount = topRatedProducts.filter(product => product.en_wishlist).length;
    
    return {
      purchasedCount,
      wishlistCount
    };
  };

  const getCategoryStats = () => {
    const categories: Record<string, number> = {};
    
    topRatedProducts.forEach(product => {
      const category = product.categoria || 'Sin categoría';
      categories[category] = (categories[category] || 0) + 1;
    });
    
    return Object.entries(categories).map(([name, count]) => ({ name, count }));
  };

  const getRatingStats = () => {
    const ratings = [0, 0, 0, 0, 0];
    
    topRatedProducts.forEach(product => {
      const rating = Math.round(parseFloat(product.calificacion_promedio));
      if (rating > 0 && rating <= 5) {
        ratings[rating - 1]++;
      }
    });
    
    return [1, 2, 3, 4, 5].map((rating, index) => ({
      rating,
      count: ratings[index]
    }));
  };

  return {
    topRatedProducts,
    userID,
    
    isLoading,
    error,
    selectedBook,
    isDetailsOpen,
    
    userStats: getUserStats(),
    categoryStats: getCategoryStats(),
    ratingStats: getRatingStats(),
  
    fetchInsights,
    handleViewDetails,
    handleCloseDetails
  };
};

export default useInsights;