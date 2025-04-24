import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Star, MessageSquare, Send, User, Edit2, Trash2 } from 'lucide-react';
import { LoadingOverlay } from '@/components/Loader/Loader';
import { useComments } from '@/features/Books/hooks/useComments';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuthStore } from '@/store/auth';

interface BookCommentSectionProps {
  productId: number;
  className?: string;
}

const BookCommentSection: React.FC<BookCommentSectionProps> = ({ productId, className = '' }) => {
  const {
    comments,
    isLoading,
    isSubmitting,
    newComment,
    setNewComment,
    rating,
    setRating,
    editingComment,
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
  } = useComments(productId);
   const { user } = useAuthStore();
  const RatingStars = ({ rating, onChange, readOnly = false }: { rating: number, onChange?: (rating: number) => void, readOnly?: boolean }) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange && onChange(star)}
            disabled={readOnly}
            className={`${readOnly ? 'cursor-default' : 'cursor-pointer'} focus:outline-none`}
          >
            <Star
              className={`h-5 w-5 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-yellow-600" />
            Reseñas y Calificaciones
          </CardTitle>
          <CardDescription>
            Opiniones de otros lectores sobre este libro
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <LoadingOverlay/>
              <p className="mt-4 text-gray-600">Cargando comentarios...</p>
            </div>
          ) : (
            <>
              {/* Botón para agregar comentario */}
              {currentUserCanComment() && !isAddingComment && (
                <Button 
                  onClick={() => setIsAddingComment(true)}
                  className="mb-6 bg-yellow-700 hover:bg-yellow-800 text-white"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Escribir una reseña
                </Button>
              )}

              {/* Formulario para agregar un comentario */}
              {isAddingComment && (
                <Card className="border-yellow-200 mb-6 animate-fadeIn">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">
                          {editingComment ? 'Editar tu reseña' : 'Escribe tu reseña'}
                        </h3>
                        <RatingStars rating={rating} onChange={setRating} />
                      </div>
                      
                      <Textarea
                        placeholder="Comparte tu opinión sobre este libro"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="min-h-[100px] resize-none border-gray-300 focus:border-yellow-500 focus-visible:ring-yellow-500/20"
                      />
                      
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          onClick={resetForm}
                          disabled={isSubmitting}
                        >
                          Cancelar
                        </Button>
                        <Button 
                          onClick={handleAddComment}
                          className="bg-yellow-700 hover:bg-yellow-800 text-white"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                              Enviando...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              {editingComment ? 'Actualizar' : 'Publicar'}
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-4">
                {comments.length === 0 ? (
                  <div className="text-center py-6">
                    <div className="mx-auto w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mb-3">
                      <MessageSquare className="h-6 w-6 text-yellow-700" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Aún no hay reseñas</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      Sé el primero en compartir tu opinión sobre este libro y ayudar a otros lectores.
                    </p>
                  </div>
                ) : (
                  <>
                    {comments.map((comment) => (
                      <Card 
                        key={comment.id_comentario} 
                        className="border-gray-200 hover:border-yellow-200 transition-colors duration-300"
                      >
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <div className="bg-yellow-100 p-2 rounded-full">
                                <User className="h-5 w-5 text-yellow-700" />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  {comment.nombre 
                                    ? `${comment.nombre} ${comment.apellido}`
                                    : `Usuario ${comment.id_cliente}`
                                  }
                                </h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <RatingStars rating={comment.calificacion} readOnly />
                                  <span className="text-sm text-gray-500">
                                    {formatDate(comment.fecha_resena)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            {comment.id_cliente === user?.id_cliente && (
                              <div className="flex gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="text-gray-500 hover:text-yellow-700"
                                  onClick={() => startEditComment(comment)}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="text-gray-500 hover:text-red-600"
                                  onClick={() => confirmDeleteComment(comment.id_comentario)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                          
                          <p className="mt-3 text-gray-700 whitespace-pre-line">
                            {comment.comentario}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Diálogo de confirmación para eliminar */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Este comentario se eliminará permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDeleteComment}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  Eliminando...
                </>
              ) : (
                'Eliminar comentario'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BookCommentSection;