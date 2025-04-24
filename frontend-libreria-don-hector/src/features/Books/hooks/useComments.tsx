import { useState, useEffect } from 'react';
import { commentService } from '../services/comment.service';
import { useAuthStore } from '@/store/auth/auth.store';
import { toast } from '@/hooks/Toast/use-toast';

export interface Comment {
  id_comentario: number;
  id_cliente: number;
  calificacion: number;
  comentario: string;
  fecha_resena: string;
  nombre?: string;
  apellido?: string;
}

export const useComments = (productId: number) => {
  const { user } = useAuthStore();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [newComment, setNewComment] = useState<string>('');
  const [rating, setRating] = useState<number>(5);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [isAddingComment, setIsAddingComment] = useState<boolean>(false);

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const commentsData = await commentService.getByProductId(productId);
      setComments(commentsData);
    } catch (error) {
      console.error('Error al cargar comentarios:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los comentarios. Por favor, intenta nuevamente más tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [productId]);

  const handleAddComment = async () => {
    if (!user?.id_cliente) {
      toast({
        title: "No autorizado",
        description: "Debes iniciar sesión para dejar un comentario.",
        variant: "destructive",
      });
      return;
    }

    if (!newComment.trim()) {
      toast({
        title: "Comentario vacío",
        description: "Por favor, escribe un comentario antes de enviarlo.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      if (editingComment) {
        await commentService.update(editingComment.id_comentario, {
          calificacion: rating,
          comentario: newComment.trim()
        });
        toast({
          title: "Comentario actualizado",
          description: "Tu comentario ha sido actualizado exitosamente.",
          variant: "default",
        });
      } else {
        const commentData = {
          id_cliente: user.id_cliente,
          id_producto: productId,
          calificacion: rating,
          comentario: newComment.trim()
        };
        await commentService.create(commentData);
        toast({
          title: "Comentario agregado",
          description: "Tu comentario ha sido publicado exitosamente.",
          variant: "default",
        });
      }

      resetForm();
      fetchComments();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data.message || "No se pudo enviar tu comentario. Por favor, intenta nuevamente más tarde.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async () => {
    if (!commentToDelete) return;

    try {
      setIsSubmitting(true);
      await commentService.delete(commentToDelete);
      setDeleteDialogOpen(false);
      setCommentToDelete(null);
      toast({
        title: "Comentario eliminado",
        description: "Tu comentario ha sido eliminado exitosamente.",
        variant: "default",
      });
      fetchComments();
    } catch (error) {
      console.error('Error al eliminar comentario:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar tu comentario. Por favor, intenta nuevamente más tarde.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentUserCanComment = () => {
    if (!user?.id_cliente) return false;
    return !comments.some(comment => comment.id_cliente === user.id_cliente);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-GT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const resetForm = () => {
    setNewComment('');
    setRating(5);
    setIsAddingComment(false);
    setEditingComment(null);
  };

  const startEditComment = (comment: Comment) => {
    setEditingComment(comment);
    setNewComment(comment.comentario);
    setRating(comment.calificacion);
    setIsAddingComment(true);
  };
  const confirmDeleteComment = (commentId: number) => {
    setCommentToDelete(commentId);
    setDeleteDialogOpen(true);
  };

  return {
    comments,
    isLoading,
    isSubmitting,
    newComment,
    setNewComment,
    rating,
    setRating,
    editingComment,
    commentToDelete,
    deleteDialogOpen,
    setDeleteDialogOpen,
    isAddingComment,
    setIsAddingComment,
    currentUserCanComment,
    formatDate,
    handleAddComment,
    handleDeleteComment,
    startEditComment,
    confirmDeleteComment,
    resetForm
  };
};

export default useComments;