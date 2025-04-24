import { useQuery } from '@tanstack/react-query';
import { commentsService } from '../services/comments.service';

export const COMMENTS_QUERY_KEYS = {
  products: ['products'] as const,
  comments: (id_producto: number) => ['comments', id_producto] as const,
};

export const useComments = () => {
  // Query para obtener todos los productos
  const {
    data: products = [],
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
    error: errorProducts,
  } = useQuery({
    queryKey: COMMENTS_QUERY_KEYS.products,
    queryFn: commentsService.getAllProducts,
  });

  // Query para obtener los comentarios de un libro
  const useCommentsByProductId = (id_producto: number) => {
    return useQuery({
      queryKey: COMMENTS_QUERY_KEYS.comments(id_producto),
      queryFn: () => commentsService.getCommentsByProductId(id_producto),
      enabled: !!id_producto, 
    });
  };

  return {
    products,
    isLoadingProducts,
    isErrorProducts,
    errorProducts,
    useCommentsByProductId,
  };
};