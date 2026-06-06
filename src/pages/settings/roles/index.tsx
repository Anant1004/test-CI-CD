
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { HugeiconsIcon } from '@hugeicons/react';
import { PlusSignIcon, PencilEdit01Icon, Delete02Icon, ShieldIcon } from '@hugeicons/core-free-icons';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_ROLES } from '@/lib/rbac-utils';
import { PermissionGuard } from '@/components/auth/permission-guard';

export const RolesPage: React.FC = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState(() => {
    const savedRoles = localStorage.getItem('roles');
    if (savedRoles) return JSON.parse(savedRoles);
    localStorage.setItem('roles', JSON.stringify(DEFAULT_ROLES));
    return DEFAULT_ROLES;
  });

  const deleteRole = (roleId: string) => {
    const updatedRoles = roles.filter((r: { id: string }) => r.id !== roleId);
    setRoles(updatedRoles);
    localStorage.setItem('roles', JSON.stringify(updatedRoles));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Role Management</h2>
          <p className="text-muted-foreground">Manage user roles and their page-level permissions.</p>
        </div>
        <PermissionGuard page="roles" action="create">
          <Button onClick={() => navigate('/settings/roles/new')} className="gap-2">
            <HugeiconsIcon icon={PlusSignIcon} size={18} />
            Create New Role
          </Button>
        </PermissionGuard>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <HugeiconsIcon icon={ShieldIcon} size={20} className="text-primary" />
            System Roles
          </CardTitle>
          <CardDescription>
            A list of all defined roles in the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="w-[200px]">Role Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[150px]">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role: { id: string; name: string; description?: string }) => (
                <TableRow key={role.id} className="hover:bg-primary/5 transition-colors border-border/50">
                  <TableCell className="font-bold">{role.name}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{role.description || 'No description provided'}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-none">
                      Active
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <PermissionGuard page="roles" action="edit">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/5">
                          <HugeiconsIcon icon={PencilEdit01Icon} size={16} />
                        </Button>
                      </PermissionGuard>
                      <PermissionGuard page="roles" action="delete">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                          onClick={() => deleteRole(role.id)}
                          disabled={role.id === 'super-admin'}
                        >
                          <HugeiconsIcon icon={Delete02Icon} size={16} />
                        </Button>
                      </PermissionGuard>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
