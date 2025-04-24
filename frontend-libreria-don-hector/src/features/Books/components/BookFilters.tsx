import React, { useState } from 'react';
import { BookSearchFilters } from '../types/books.types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  Search, 
  X, 
  Filter, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';

interface BookFiltersProps {
  filters: BookSearchFilters;
  onUpdateFilters: (filters: Partial<BookSearchFilters>) => void;
  onClearFilters: () => void;
}

export const BookFilters: React.FC<BookFiltersProps> = ({
  filters,
  onUpdateFilters,
  onClearFilters,
}) => {
  const [localFilters, setLocalFilters] = useState<BookSearchFilters>(filters);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof BookSearchFilters
  ) => {
    let value: string | number = e.target.value;
    
    if (field === 'precio_min' || field === 'precio_max') {
      value = value === '' ? '' : Number(value);
    }
    
    setLocalFilters({
      ...localFilters,
      [field]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateFilters(localFilters);
  };

  const handleClear = () => {
    setLocalFilters({});
    onClearFilters();
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden transition-all duration-300">
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-800/90 to-gray-900/90 text-white">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          <h3 className="font-semibold">Filtros de Búsqueda</h3>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-white hover:bg-white/20" 
          onClick={toggleExpanded}
        >
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </Button>
      </div>
      
      {isExpanded && (
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="titulo" className="text-sm font-medium text-gray-700">
                Título
              </Label>
              <Input
                id="titulo"
                placeholder="Buscar por título"
                value={localFilters.titulo || ''}
                onChange={(e) => handleFilterChange(e, 'titulo')}
                className="border-gray-300 focus:border-yellow-500 focus:ring focus:ring-yellow-200 focus:ring-opacity-50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="autor" className="text-sm font-medium text-gray-700">
                Autor
              </Label>
              <Input
                id="autor"
                placeholder="Buscar por autor"
                value={localFilters.autor || ''}
                onChange={(e) => handleFilterChange(e, 'autor')}
                className="border-gray-300 focus:border-yellow-500 focus:ring focus:ring-yellow-200 focus:ring-opacity-50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="genero" className="text-sm font-medium text-gray-700">
                Género
              </Label>
              <Input
                id="genero"
                placeholder="Buscar por género"
                value={localFilters.genero || ''}
                onChange={(e) => handleFilterChange(e, 'genero')}
                className="border-gray-300 focus:border-yellow-500 focus:ring focus:ring-yellow-200 focus:ring-opacity-50"
              />
            </div>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="precio">
              <AccordionTrigger className="py-2 text-sm font-medium text-gray-700 hover:text-yellow-700">
                Rango de Precio
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="precio_min" className="text-sm font-medium text-gray-700">
                      Precio Mínimo
                    </Label>
                    <Input
                      id="precio_min"
                      type="number"
                      placeholder="Q"
                      min={0}
                      value={localFilters.precio_min || ''}
                      onChange={(e) => handleFilterChange(e, 'precio_min')}
                      className="border-gray-300 focus:border-yellow-500 focus:ring focus:ring-yellow-200 focus:ring-opacity-50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="precio_max" className="text-sm font-medium text-gray-700">
                      Precio Máximo
                    </Label>
                    <Input
                      id="precio_max"
                      type="number"
                      placeholder="Q"
                      min={0}
                      value={localFilters.precio_max || ''}
                      onChange={(e) => handleFilterChange(e, 'precio_max')}
                      className="border-gray-300 focus:border-yellow-500 focus:ring focus:ring-yellow-200 focus:ring-opacity-50"
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <div className="flex justify-between pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClear}
              className="text-gray-700 border-gray-300 hover:bg-gray-100"
            >
              <X className="h-4 w-4 mr-1" />
              Limpiar
            </Button>
            
            <Button
              type="submit"
              size="sm"
              className="bg-yellow-700 hover:bg-yellow-800 text-white"
            >
              <Search className="h-4 w-4 mr-1" />
              Buscar
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default BookFilters;