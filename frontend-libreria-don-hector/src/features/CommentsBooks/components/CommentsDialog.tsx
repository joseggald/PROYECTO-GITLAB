import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Comment } from '../types/comments.type';

interface CommentsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    nombre: string;
    autor: string;
    fecha_lanzamiento: string;
  };
  comments: Comment[];
}

export const CommentsDialog: React.FC<CommentsDialogProps> = ({ isOpen, onClose, product, comments }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent style={{ backgroundColor: '#FFF8E1', padding: '20px', borderRadius: '8px' }}>
                <DialogHeader>
                    <DialogTitle style={{ color: '#6D4C41', fontSize: '24px', fontWeight: 'bold' }}>Comentarios de {product.nombre}</DialogTitle>
                    <DialogDescription style={{ color: '#8D6E63', fontSize: '16px' }}>
                        Autor: {product.autor} <br />
                        Fecha Publicación: {new Date(product.fecha_lanzamiento).toLocaleDateString()}
                    </DialogDescription>
                </DialogHeader>
                {comments.length > 0 ? (
                    <Table style={{ borderColor: '#FFCC80', borderWidth: '1px', borderStyle: 'solid', marginTop: '20px' }}>
                        <TableHeader>
                            <TableRow>
                                <TableHead style={{ backgroundColor: '#FFE0B2', color: '#4E342E', padding: '10px' }}>Comentario</TableHead>
                                <TableHead style={{ backgroundColor: '#FFE0B2', color: '#4E342E', padding: '10px' }}>Fecha de Reseña</TableHead>
                                <TableHead style={{ backgroundColor: '#FFE0B2', color: '#4E342E', padding: '10px' }}>Calificación</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {comments.map((comment) => (
                                <TableRow key={comment.id_comentario}>
                                    <TableCell style={{ backgroundColor: '#FFF8E1', color: '#4E342E', padding: '10px', maxWidth: '600px', wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>{comment.comentario}</TableCell>
                                    <TableCell style={{ backgroundColor: '#FFF8E1', color: '#4E342E', padding: '10px' }}>{new Date(comment.fecha_resena).toLocaleDateString()}</TableCell>
                                    <TableCell style={{ backgroundColor: '#FFF8E1', color: '#4E342E', padding: '10px' }}>{comment.calificacion}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <p style={{ color: '#4E342E', fontSize: '16px', marginTop: '20px' }}>No hay opiniones y comentarios.</p>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default CommentsDialog;