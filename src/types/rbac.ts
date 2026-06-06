
export type Action = 'view' | 'create' | 'edit' | 'delete';

export interface PagePermission {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: Record<string, PagePermission>;
}

export interface User {
  id: string;
  username: string;
  role: Role;
}
