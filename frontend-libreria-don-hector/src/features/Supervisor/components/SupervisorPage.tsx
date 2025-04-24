import React from 'react';
import { useSupervisors } from '../hooks/useSupervisors';
import SupervisorGrid from '../components/SupervisorGrid';
import { 
  CreateSupervisorDialog,
  UpdateSupervisorDialog,
  DeactivateSupervisorDialog,
  SupervisorDetailsDialog
} from '../components/SupervisorForms';
import { Card } from '@/components/ui/card';

const SupervisoresPage: React.FC = () => {
  const {
    supervisors,
    selectedSupervisor,
    isLoading,
    isError,
    isCreating,
    isUpdating,
    isDeactivating,
    
    // Dialog states
    isCreateDialogOpen,
    isUpdateDialogOpen,
    isDeactivateDialogOpen,
    isDetailsDialogOpen,
    
    // Dialog handlers
    openCreateDialog,
    closeCreateDialog,
    openUpdateDialog,
    closeUpdateDialog,
    openDeactivateDialog,
    closeDeactivateDialog,
    openDetailsDialog,
    closeDetailsDialog,
    
    // Operations
    createSupervisor,
    updateSupervisor,
    deactivateSupervisor,
    
    // Formatters
    formatDate
  } = useSupervisors();

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Gestión de Supervisores</h1>
      
      <Card className="p-6">
        <SupervisorGrid
          supervisors={supervisors}
          isLoading={isLoading}
          isError={isError}
          onView={openDetailsDialog}
          onEdit={openUpdateDialog}
          onDeactivate={openDeactivateDialog}
          onCreateNew={openCreateDialog}
          formatDate={formatDate}
        />
      </Card>
      
      {/* Dialogs */}
      <CreateSupervisorDialog
        isOpen={isCreateDialogOpen}
        onClose={closeCreateDialog}
        onSubmit={createSupervisor}
        isSubmitting={isCreating}
      />
      
      <UpdateSupervisorDialog
        isOpen={isUpdateDialogOpen}
        onClose={closeUpdateDialog}
        supervisor={selectedSupervisor}
        onSubmit={updateSupervisor}
        isSubmitting={isUpdating}
      />
      
      <DeactivateSupervisorDialog
        isOpen={isDeactivateDialogOpen}
        onClose={closeDeactivateDialog}
        supervisor={selectedSupervisor}
        onSubmit={deactivateSupervisor}
        isSubmitting={isDeactivating}
      />
      
      <SupervisorDetailsDialog
        isOpen={isDetailsDialogOpen}
        onClose={closeDetailsDialog}
        supervisor={selectedSupervisor}
        formatDate={formatDate}
      />
    </div>
  );
};

export default SupervisoresPage;