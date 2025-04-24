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
  Employee,
  EmployeeFormData,
  UpdateEmployeeData,
  DeactivateEmployeeData,
  Invoice
} from '../types/employee.types';
import { User, Phone, Mail, Calendar, AlertCircle } from 'lucide-react';


// Dialog para crear un nuevo empleado
export const CreateEmployeeDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EmployeeFormData) => void;
  isSubmitting: boolean;
}> = ({ isOpen, onClose, onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState<EmployeeFormData>({
    nombre: '',
    apellido: '',
    cui: '',
    edad: 0,
    genero: '',
    telefono: '',
    correo_electronico: '',
    id_rol: 3,
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
        id_rol: 3,
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
          <DialogTitle>Crear Nuevo Empleado</DialogTitle>
          <DialogDescription>
            Complete el formulario para crear un nuevo empleado
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
            <Label htmlFor="fecha_ingreso">Fecha de Contratacion</Label>
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
                'Guardar Empleado'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Dialog para actualizar un empleado
export const UpdateEmployeeDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  onSubmit: (data: UpdateEmployeeData) => void;
  isSubmitting: boolean;
}> = ({ isOpen, onClose, employee, onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState<UpdateEmployeeData>({
    id_empleado: 0,
    correo_electronico: '',
    telefono: ''
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        id_empleado: employee.id_empleado,
        correo_electronico: employee.correo_electronico || '',
        telefono: employee.telefono
      });
    }
  }, [employee]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (employee) {
      onSubmit(formData);
    }
  };

  if (!employee) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Actualizar Empleado</DialogTitle>
          <DialogDescription>
            Actualice la información de contacto del empleado
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="nombreCompleto">Empleado</Label>
            <div className="flex items-center p-2 rounded-md bg-gray-100">
              <User className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                {employee.nombre} {employee.apellido}
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
                'Actualizar Empleado'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Dialog para desactivar un empleado
export const DeactivateEmployeeDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  onSubmit: (data: DeactivateEmployeeData) => void;
  isSubmitting: boolean;
}> = ({ isOpen, onClose, employee, onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState<DeactivateEmployeeData>({
    id_empleado: 0,
    fecha_baja: new Date().toISOString().split('T')[0],
    razon_baja: ''
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        id_empleado: employee.id_empleado,
        fecha_baja: new Date().toISOString().split('T')[0],
        razon_baja: ''
      });
    }
  }, [employee]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (employee) {
      onSubmit(formData);
    }
  };

  if (!employee) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Desactivar Empleado</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción desactivará al empleado {employee.nombre} {employee.apellido}.
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
                  'Desactivar Empleado'
                )}
              </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

// Dialog para ver detalles de un empleado
export const EmployeeDetailsDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  formatDate: (date: string) => string;
}> = ({ isOpen, onClose, employee, formatDate }) => {
  if (!employee) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Detalles del Empleado</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center justify-center mb-4">
            <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="h-10 w-10 text-blue-700" />
            </div>
          </div>

          <h3 className="text-center text-xl font-bold text-gray-900">
            {employee.nombre} {employee.apellido}
          </h3>

          <div className="grid grid-cols-1 gap-4 pt-4">
            <div className="flex items-start">
              <div className="mr-2 mt-1">
                <User className="h-5 w-5 text-gray-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Identificación (CUI)</p>
                <p className="text-base text-gray-900">{employee.cui}</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="mr-2 mt-1">
                <Phone className="h-5 w-5 text-gray-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Teléfono</p>
                <p className="text-base text-gray-900">{employee.telefono}</p>
              </div>
            </div>

            {employee.correo_electronico && (
              <div className="flex items-start">
                <div className="mr-2 mt-1">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Correo Electrónico</p>
                  <p className="text-base text-gray-900">{employee.correo_electronico}</p>
                </div>
              </div>
            )}

            <div className="flex items-start">
              <div className="mr-2 mt-1">
                <Calendar className="h-5 w-5 text-gray-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Fecha de Ingreso</p>
                <p className="text-base text-gray-900">{formatDate(employee.fecha_contratacion || '')}</p>
              </div>
            </div>

            {(employee.estado === "0" || employee.fecha_baja) && (
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

                {employee.fecha_baja && (
                  <div className="flex items-start">
                    <div className="mr-2 mt-1">
                      <Calendar className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-red-500">Fecha de Baja</p>
                      <p className="text-base text-red-700">{formatDate(employee.fecha_baja || '')}</p>
                    </div>
                  </div>
                )}

                {employee.razon_baja && (
                  <div className="flex items-start">
                    <div className="mr-2 mt-1">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-red-500">Razón de Baja</p>
                      <p className="text-base text-red-700">{employee.razon_baja}</p>
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

// Dialog para mostrar lista de facturas de un empleado
export const EmployeeInvoicesDialog: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    employee: Employee | null;
    formatDate: (date: string) => string;
}> = ({ isOpen, onClose, employee, formatDate }) => {
    const [filterMonth, setFilterMonth] = useState<string>('');

    if (!employee) return null;

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilterMonth(e.target.value);
    };

    const filteredInvoices = employee.facturas?.filter((invoice: Invoice) => {
        if (!filterMonth) return true;
        const invoiceMonth = invoice.fecha_emision ? new Date(invoice.fecha_emision).toISOString().slice(0, 7) : '';
        return invoiceMonth === filterMonth;
    }) || [];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Facturas del Empleado</DialogTitle>
                    <DialogDescription>
                        Lista de facturas generadas por el empleado {employee.nombre} {employee.apellido}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="filterMonth">Filtrar por Mes</Label>
                        <Input
                            id="filterMonth"
                            name="filterMonth"
                            type="month"
                            value={filterMonth}
                            onChange={handleFilterChange}
                        />
                    </div>

                    {filteredInvoices.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2 border">ID Factura</th>
                                        <th className="px-4 py-2 border">Fecha</th>
                                        <th className="px-4 py-2 border">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredInvoices.map((invoice: Invoice) => (
                                        <tr key={invoice.id_factura}>
                                            <td className="px-4 py-2 border">{invoice.id_factura || 'N/A'}</td>
                                            <td className="px-4 py-2 border">{invoice.fecha_emision ? formatDate(invoice.fecha_emision) : 'N/A'}</td>
                                            <td className="px-4 py-2 border">{invoice.total_venta || 'N/A'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan={2} className="px-4 py-2 border font-bold">Total</td>
                                        <td className="px-4 py-2 border font-bold">
                                            {filteredInvoices.reduce((acc, invoice) => acc + (invoice.total_venta || 0), 0)}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    ) : (
                        <p className="text-center text-gray-500">No hay facturas disponibles para este empleado.</p>
                    )}
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