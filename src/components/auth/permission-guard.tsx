
import React from 'react';
import { hasPermission } from '@/lib/rbac-utils';

interface PermissionGuardProps {
  page: string;
  action: 'view' | 'create' | 'edit' | 'delete';
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({ 
  page, 
  action, 
  children, 
  fallback = null 
}) => {
  if (hasPermission(page, action)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};
