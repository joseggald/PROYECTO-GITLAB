import { useEmployees } from '../hooks/useEmployees';
import EmployeeGrid from './EmployeeGrid';
import { 
  CreateEmployeeDialog,
  UpdateEmployeeDialog,
  DeactivateEmployeeDialog,
  EmployeeDetailsDialog,
  EmployeeInvoicesDialog
} from './EmployeeForms';
import { Card } from '@/components/ui/card';

const EmployeesPage: React.FC = () => {
  const {
    employees,
    selectedEmployee,
    isLoading,
    isError,
    isCreating,
    isUpdating,
    isDeactivating,
    // ...existing code...
    isCreateDialogOpen,
    isUpdateDialogOpen,
    isDeactivateDialogOpen,
    isDetailsDialogOpen,
    isInvoicesDialogOpen,
    // ...existing code...
    openCreateDialog,
    closeCreateDialog,
    openUpdateDialog,
    closeUpdateDialog,
    openDeactivateDialog,
    closeDeactivateDialog,
    openDetailsDialog,
    closeDetailsDialog,
    openInvoicesDialog,
    closeInvoicesDialog,
    // ...existing code...
    createEmployee,
    updateEmployee,
    deactivateEmployee,
    // ...existing code...
    formatDate
  } = useEmployees();

  

  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Gestión de Empleados</h1>
      
      <Card className="p-6">
        <EmployeeGrid
          employees={employees}
          isLoading={isLoading}
          isError={isError}
          onView={openDetailsDialog}
          onEdit={openUpdateDialog}
          onDeactivate={openDeactivateDialog}
          onCreateNew={openCreateDialog}
          onViewInvoices={openInvoicesDialog}
          formatDate={formatDate}
        />
      </Card>
      
      {/* Dialogs */}
      <CreateEmployeeDialog
        isOpen={isCreateDialogOpen}
        onClose={closeCreateDialog}
        onSubmit={createEmployee}
        isSubmitting={isCreating}
      />
      
      <UpdateEmployeeDialog
        isOpen={isUpdateDialogOpen}
        onClose={closeUpdateDialog}
        employee={selectedEmployee}
        onSubmit={updateEmployee}
        isSubmitting={isUpdating}
      />
      
      <DeactivateEmployeeDialog
        isOpen={isDeactivateDialogOpen}
        onClose={closeDeactivateDialog}
        employee={selectedEmployee}
        onSubmit={deactivateEmployee}
        isSubmitting={isDeactivating}
      />
      
      <EmployeeDetailsDialog
        isOpen={isDetailsDialogOpen}
        onClose={closeDetailsDialog}
        employee={selectedEmployee}
        formatDate={formatDate}
      />

      <EmployeeInvoicesDialog
        isOpen={isInvoicesDialogOpen}
        onClose={closeInvoicesDialog}
        employee={selectedEmployee}
        formatDate={formatDate}
      />
    </div>
  );
};

export default EmployeesPage;
