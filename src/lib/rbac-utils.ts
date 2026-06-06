
export const APP_PAGES = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'patients', label: 'Patients' },
  { id: 'appointments', label: 'Appointments' },
  { id: 'settings', label: 'Settings' },
  { id: 'roles', label: 'Role Management' },
];

export const DEFAULT_ROLES = [
  {
    id: 'super-admin',
    name: 'Super Admin',
    description: 'Full system access',
    permissions: APP_PAGES.reduce((acc, page) => {
      acc[page.id] = { view: true, create: true, edit: true, delete: true };
      return acc;
    }, {} as Record<string, { view: boolean; create: boolean; edit: boolean; delete: boolean; }>),
  },
  {
    id: 'doctor-role',
    name: 'Doctor',
    description: 'Medical staff',
    permissions: {
      dashboard: { view: true, create: false, edit: false, delete: false },
      patients: { view: true, create: true, edit: true, delete: false },
      appointments: { view: true, create: true, edit: true, delete: true },
      settings: { view: false, create: false, edit: false, delete: false },
      roles: { view: false, create: false, edit: false, delete: false },
    }
  }
];

export const DEFAULT_USERS = [
  {
    username: 'admin',
    password: '123',
    roleId: 'super-admin'
  },
  {
    username: 'doctor',
    password: '123',
    roleId: 'doctor-role'
  }
];

export const hasPermission = (pageId: string, action: 'view' | 'create' | 'edit' | 'delete') => {
  if (typeof window === 'undefined') return false;
  const userJson = localStorage.getItem('user');
  if (!userJson) return false;
  
  try {
    const user = JSON.parse(userJson);
    if (user.role?.id === 'super-admin') return true;
    
    const permission = user.role?.permissions?.[pageId];
    return permission ? permission[action] : false;
  } catch {
    return false;
  }
};
