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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Supervisor,
  SupervisorFormData,
  UpdateSupervisorData,
  DeactivateSupervisorData
} from '../types/supervisor.types';
import { User, Phone, Mail, Calendar, AlertCircle } from 'lucide-react';

// Dialog para crear un nuevo supervisor
export const CreateSupervisorDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SupervisorFormData) => void;
  isSubmitting: boolean;
}> = ({ isOpen, onClose, onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState<SupervisorFormData>({
    nombre: '',
    apellido: '',
    cui: '',
    edad: 0,
    genero: '',
    telefono: '',
    correo_electronico: '',
    id_rol: 2,
    fecha_ingreso: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        nombre: '',
        apellido: '',
        cui: '',
        edad: 0,
        genero: '',
        telefono: '',
        correo_electronico: '',
        id_rol: 2,
        fecha_ingreso: new Date().toISOString().split('T')[0],
      });
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'edad' ? (value ? parseInt(value) : 0) : value
    }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Supervisor</DialogTitle>
          <DialogDescription>
            Complete el formulario para crear un nuevo supervisor
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
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
              <Label htmlFor="apellido">Apellido</Label>
              <Input
                id="apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cui">CUI</Label>
              <Input
                id="cui"
                name="cui"
                value={formData.cui}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edad">Edad</Label>
              <Input
                id="edad"
                name="edad"
                type="number"
                min="18"
                max="100"
                value={formData.edad || ''}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="genero">Género</Label>
              <Select
                value={formData.genero}
                onValueChange={(value) => handleSelectChange(value, 'genero')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar género" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Masculino</SelectItem>
                  <SelectItem value="F">Femenino</SelectItem>
                  <SelectItem value="O">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="correo_electronico">Correo Electrónico</Label>
            <Input
              id="correo_electronico"
              name="correo_electronico"
              type="email"
              value={formData.correo_electronico}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fecha_ingreso">Fecha de Ingreso</Label>
            <Input
              id="fecha_ingreso"
              name="fecha_ingreso"
              type="date"
              value={formData.fecha_ingreso}
              onChange={handleChange}
              required
            />
          </div>

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
                'Guardar Supervisor'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Dialog para actualizar un supervisor
export const UpdateSupervisorDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  supervisor: Supervisor | null;
  onSubmit: (data: UpdateSupervisorData) => void;
  isSubmitting: boolean;
}> = ({ isOpen, onClose, supervisor, onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState<UpdateSupervisorData>({
    id_supervisor: 0,
    correo_electronico: '',
    telefono: ''
  });

  useEffect(() => {
    if (supervisor) {
      setFormData({
        id_supervisor: supervisor.id_supervisor,
        correo_electronico: supervisor.correo_electronico || '',
        telefono: supervisor.telefono
      });
    }
  }, [supervisor]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (supervisor) {
      onSubmit(formData);
    }
  };

  if (!supervisor) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Actualizar Supervisor</DialogTitle>
          <DialogDescription>
            Actualice la información de contacto del supervisor
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="nombreCompleto">Supervisor</Label>
            <div className="flex items-center p-2 rounded-md bg-gray-100">
              <User className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                {supervisor.nombre} {supervisor.apellido}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="correo_electronico">Correo Electrónico</Label>
            <Input
              id="correo_electronico"
              name="correo_electronico"
              type="email"
              value={formData.correo_electronico}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefono">Teléfono</Label>
            <Input
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              required
            />
          </div>

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
                'Actualizar Supervisor'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Dialog para desactivar un supervisor
export const DeactivateSupervisorDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  supervisor: Supervisor | null;
  onSubmit: (data: DeactivateSupervisorData) => void;
  isSubmitting: boolean;
}> = ({ isOpen, onClose, supervisor, onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState<DeactivateSupervisorData>({
    id_supervisor: 0,
    fecha_baja: new Date().toISOString().split('T')[0],
    razon_baja: ''
  });

  useEffect(() => {
    if (supervisor) {
      setFormData({
        id_supervisor: supervisor.id_supervisor,
        fecha_baja: new Date().toISOString().split('T')[0],
        razon_baja: ''
      });
    }
  }, [supervisor]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (supervisor) {
      onSubmit(formData);
    }
  };

  if (!supervisor) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Desactivar Supervisor</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción desactivará al supervisor {supervisor.nombre} {supervisor.apellido}.
            Por favor proporcione la información requerida.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="fecha_baja">Fecha de Baja</Label>
            <Input
              id="fecha_baja"
              name="fecha_baja"
              type="date"
              value={formData.fecha_baja}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="razon_baja">Razón de la Baja</Label>
            <Textarea
              id="razon_baja"
              name="razon_baja"
              value={formData.razon_baja}
              onChange={handleChange}
              placeholder="Indique el motivo de la desactivación"
              required
              className="min-h-[100px]"
            />
          </div>

          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel disabled={isSubmitting}>Cancelar</AlertDialogCancel>            
              <Button type="submit" variant="destructive">
                {isSubmitting ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    Desactivando...
                  </>
                ) : (
                  'Desactivar Supervisor'
                )}
              </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

// Dialog para ver detalles de un supervisor
export const SupervisorDetailsDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  supervisor: Supervisor | null;
  formatDate: (date: string) => string;
}> = ({ isOpen, onClose, supervisor, formatDate }) => {
  if (!supervisor) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Detalles del Supervisor</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center justify-center mb-4">
            <div className="h-20 w-20 rounded-full bg-yellow-100 flex items-center justify-center">
              <User className="h-10 w-10 text-yellow-700" />
            </div>
          </div>

          <h3 className="text-center text-xl font-bold text-gray-900">
            {supervisor.nombre} {supervisor.apellido}
          </h3>

          <div className="grid grid-cols-1 gap-4 pt-4">
            <div className="flex items-start">
              <div className="mr-2 mt-1">
                <User className="h-5 w-5 text-gray-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Identificación (CUI)</p>
                <p className="text-base text-gray-900">{supervisor.cui}</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="mr-2 mt-1">
                <Phone className="h-5 w-5 text-gray-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Teléfono</p>
                <p className="text-base text-gray-900">{supervisor.telefono}</p>
              </div>
            </div>

            {supervisor.correo_electronico && (
              <div className="flex items-start">
                <div className="mr-2 mt-1">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Correo Electrónico</p>
                  <p className="text-base text-gray-900">{supervisor.correo_electronico}</p>
                </div>
              </div>
            )}

            <div className="flex items-start">
              <div className="mr-2 mt-1">
                <Calendar className="h-5 w-5 text-gray-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Fecha de Ingreso</p>
                <p className="text-base text-gray-900">{formatDate(supervisor.fecha_ingreso)}</p>
              </div>
            </div>

            {(supervisor.estado === "0" || supervisor.fecha_baja) && (
              <>
                <div className="flex items-start">
                  <div className="mr-2 mt-1">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-red-500">Estado</p>
                    <p className="text-base text-red-700">Inactivo</p>
                  </div>
                </div>

                {supervisor.fecha_baja && (
                  <div className="flex items-start">
                    <div className="mr-2 mt-1">
                      <Calendar className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-red-500">Fecha de Baja</p>
                      <p className="text-base text-red-700">{formatDate(supervisor.fecha_baja || '')}</p>
                    </div>
                  </div>
                )}

                {supervisor.razon_baja && (
                  <div className="flex items-start">
                    <div className="mr-2 mt-1">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-red-500">Razón de Baja</p>
                      <p className="text-base text-red-700">{supervisor.razon_baja}</p>
                    </div>
                  </div>
                )}
              </>
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