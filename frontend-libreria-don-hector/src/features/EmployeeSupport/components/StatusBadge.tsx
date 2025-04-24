import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const statusColors = {
    Pendiente: 'bg-yellow-100 text-yellow-800',
    'En Proceso': 'bg-blue-100 text-blue-800',
    Aprobación: 'bg-purple-100 text-purple-800',
    Resuelto: 'bg-green-100 text-green-800',
    Cancelado: 'bg-red-100 text-red-800'
  };

  return (
    <span
      className={cn(
        'px-2 py-1 rounded-full text-xs font-medium',
        statusColors[status as keyof typeof statusColors],
        className
      )}
    >
      {status}
    </span>
  );
};