import React, { useState } from 'react';
import { Sidebar } from './sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Outlet, useLocation } from 'react-router-dom';

interface MainLayoutProps {
  onLogout: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ onLogout }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const username = localStorage.getItem('username') || 'User';
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Hospital Overview';
    if (path === '/patients') return 'Patients Directory';
    if (path === '/appointments') return 'Appointments';
    if (path === '/settings') return 'System Settings';
    return 'Hospi';
  };

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-background animate-in fade-in duration-500 overflow-hidden">
        <Sidebar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          onLogout={onLogout}
        />

        <main className="flex-1 overflow-y-auto scrollbar-none">
          <header className="h-16 border-b border-border bg-background/50 backdrop-blur-sm sticky top-0 z-10 px-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold tracking-tight">{getPageTitle()}</h1>
              <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary border-none font-semibold text-[10px] uppercase tracking-wider">
                Live Data
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold leading-none">{username}</p>
                <p className="text-[10px] text-muted-foreground mt-1 font-medium uppercase tracking-wider">Administrator</p>
              </div>
              <Avatar className="h-10 w-10 border-2 border-primary/10 shadow-sm transition-transform hover:scale-105 duration-300">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                  {username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </header>

          <div className="p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
};
