
import React from 'react';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { PlusSignIcon, PencilEdit01Icon, Delete02Icon } from '@hugeicons/core-free-icons';
import { useNavigate } from 'react-router-dom';
import { PermissionGuard } from '@/components/auth/permission-guard';

export const PatientsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Patients</h2>
          <p className="text-muted-foreground">Manage patient records and clinical history.</p>
        </div>
        <PermissionGuard page="patients" action="create">
          <Button onClick={() => navigate('/patients/new')} className="gap-2">
            <HugeiconsIcon icon={PlusSignIcon} size={18} />
            Add New Patient
          </Button>
        </PermissionGuard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((id) => (
          <div key={id} className="p-6 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                P{id}
              </div>
              <div className="flex gap-2">
                <PermissionGuard page="patients" action="edit">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <HugeiconsIcon icon={PencilEdit01Icon} size={16} />
                  </Button>
                </PermissionGuard>
                <PermissionGuard page="patients" action="delete">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                    <HugeiconsIcon icon={Delete02Icon} size={16} />
                  </Button>
                </PermissionGuard>
              </div>
            </div>
            <div>
              <h3 className="font-bold">Patient Name {id}</h3>
              <p className="text-sm text-muted-foreground">ID: #PT-2024-00{id}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
