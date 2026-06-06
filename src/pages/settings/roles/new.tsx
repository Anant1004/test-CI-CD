
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft01Icon, SaveIcon, ShieldIcon } from '@hugeicons/core-free-icons';
import { useNavigate } from 'react-router-dom';
import { APP_PAGES } from '@/lib/rbac-utils';

export const CreateRolePage: React.FC = () => {
  const navigate = useNavigate();
  
  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');
  
  const [permissions, setPermissions] = useState<Record<string, any>>(
    APP_PAGES.reduce((acc, page) => {
      acc[page.id] = { view: false, create: false, edit: false, delete: false };
      return acc;
    }, {} as any)
  );

  const togglePermission = (pageId: string, action: string) => {
    setPermissions(prev => ({
      ...prev,
      [pageId]: {
        ...prev[pageId],
        [action]: !prev[pageId][action]
      }
    }));
  };

  const handleSave = () => {
    if (!roleName) return;

    const roleId = roleName.toLowerCase().replace(/\s+/g, '-');
    const newRole = {
      id: roleId,
      name: roleName,
      description,
      permissions
    };

    // Save Role
    const savedRoles = localStorage.getItem('roles');
    const roles = savedRoles ? JSON.parse(savedRoles) : [];
    localStorage.setItem('roles', JSON.stringify([...roles, newRole]));

    navigate('/settings/roles');
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/settings/roles')}>
          <HugeiconsIcon icon={ArrowLeft01Icon} size={20} />
        </Button>
        <div className="flex-1 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Create Role</h2>
            <p className="text-muted-foreground">Define a new role and configure its permissions.</p>
          </div>
          <Button className="gap-2" onClick={handleSave} disabled={!roleName}>
            <HugeiconsIcon icon={SaveIcon} size={18} />
            Save Role
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Role Details */}
        <div className="space-y-6 lg:col-span-1">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <HugeiconsIcon icon={ShieldIcon} size={20} className="text-primary" />
                Role Details
              </CardTitle>
              <CardDescription>Basic information about the role.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="roleName">Role Name <span className="text-destructive">*</span></Label>
                <Input 
                  id="roleName" 
                  placeholder="e.g. Nurse, Pharmacist" 
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input 
                  id="description" 
                  placeholder="Role responsibilities..." 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Permissions Matrix */}
        <Card className="lg:col-span-2 border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Permission Matrix</CardTitle>
            <CardDescription>Assign module permissions for this new role.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border/50">
                  <TableHead className="w-[200px]">Module / Page</TableHead>
                  <TableHead className="text-center">View</TableHead>
                  <TableHead className="text-center">Create</TableHead>
                  <TableHead className="text-center">Edit</TableHead>
                  <TableHead className="text-center">Delete</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {APP_PAGES.map((page) => (
                  <TableRow key={page.id} className="hover:bg-primary/5 transition-colors border-border/50">
                    <TableCell className="font-medium">{page.label}</TableCell>
                    <TableCell className="text-center">
                      <Checkbox 
                        checked={permissions[page.id].view} 
                        onCheckedChange={() => togglePermission(page.id, 'view')}
                        className="mx-auto"
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox 
                        checked={permissions[page.id].create} 
                        onCheckedChange={() => togglePermission(page.id, 'create')}
                        className="mx-auto"
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox 
                        checked={permissions[page.id].edit} 
                        onCheckedChange={() => togglePermission(page.id, 'edit')}
                        className="mx-auto"
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox 
                        checked={permissions[page.id].delete} 
                        onCheckedChange={() => togglePermission(page.id, 'delete')}
                        className="mx-auto"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
