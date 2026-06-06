
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Logout01Icon,
  Layout01Icon,
  UserGroupIcon,
  Calendar03Icon,
  Settings02Icon,
  SidebarLeftIcon,
  Menu01Icon,
  DragDropIcon,
  ArrowDown01Icon
} from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useNavigate, useLocation, type Location } from 'react-router-dom';
import { hasPermission } from '@/lib/rbac-utils';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  onLogout: () => void;
}

interface SubMenuItem {
  id: string;
  label: string;
  path: string;
}

interface MenuItem {
  id: string;
  icon: any;
  label: string;
  path?: string;
  subItems?: SubMenuItem[];
}

const DEFAULT_MENU_ITEMS: MenuItem[] = [
  { id: 'dashboard', icon: Layout01Icon, label: 'Dashboard', path: '/' },
  {
    id: 'patients',
    icon: UserGroupIcon,
    label: 'Patients',
    subItems: [
      { id: 'all-patients', label: 'All Patients', path: '/patients' },
      { id: 'add-patient', label: 'Add New Patient', path: '/patients/new' },
      { id: 'patient-reports', label: 'Reports', path: '/patients/reports' },
    ]
  },
  { id: 'appointments', icon: Calendar03Icon, label: 'Appointments', path: '/appointments' },
  {
    id: 'roles',
    icon: Settings02Icon,
    label: 'Role Management',
    subItems: [
      { id: 'view-roles', label: 'All Roles', path: '/settings/roles' },
      { id: 'create-role', label: 'Create Role', path: '/settings/roles/new' },
    ]
  },
  { id: 'settings', icon: Settings02Icon, label: 'Settings', path: '/settings' },
];

const SortableMenuItem = ({
  item,
  isCollapsed,
  navigate,
  location
}: {
  item: MenuItem,
  isCollapsed: boolean,
  navigate: (path: string) => void,
  location: Location
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: item.id });

  const hasSubItems = item.subItems && item.subItems.length > 0;
  const isChildActive = hasSubItems && item.subItems?.some(sub => location.pathname === sub.path);
  const isActive = item.path === location.pathname || isChildActive;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.6 : 1,
  };

  const handleMainClick = () => {
    if (isCollapsed) return;
    if (hasSubItems) {
      setIsOpen(!isOpen);
    } else if (item.path) {
      navigate(item.path);
    }
  };

  if (isCollapsed && hasSubItems) {
    return (
      <div ref={setNodeRef} style={style} className="relative w-full flex justify-center py-0">
        <Tooltip delayDuration={0}>
          <DropdownMenu>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-11 w-11 transition-all duration-200",
                    isActive ? 'text-primary bg-primary/5' : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                  )}
                >
                  <div className={cn(
                    "transition-transform duration-300",
                    isActive ? "scale-110" : "group-hover:scale-110",
                  )}>
                    <HugeiconsIcon icon={item.icon} size={20} />
                  </div>
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <DropdownMenuContent side="right" sideOffset={12} className="min-w-48 p-1 rounded-none border-border shadow-xl">
              <div className="px-3 py-2 border-b border-border mb-1">
                <span className="text-[10px] font-bold tracking-widest text-muted-foreground">{item.label}</span>
              </div>
              {item.subItems?.map(sub => (
                <DropdownMenuItem
                  key={sub.id}
                  onClick={() => navigate(sub.path)}
                  className={cn(
                    "cursor-pointer font-bold text-[11px] tracking-wider py-2",
                    location.pathname === sub.path ? "bg-primary/10 text-primary" : ""
                  )}
                >
                  {sub.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <TooltipContent side="right" sideOffset={12} className="font-bold text-[10px] tracking-widest py-1.5 px-3">
            {item.label}
          </TooltipContent>
        </Tooltip>
      </div>
    );
  }

  return (
    <div ref={setNodeRef} style={style} className="relative w-full flex flex-col gap-1 px-2 py-0">
      <div className="flex items-center w-full gap-0.5 group">
        {!isCollapsed && (
          <div
            {...attributes}
            {...listeners}
            className="opacity-40 hover:opacity-100 cursor-grab active:cursor-grabbing text-muted-foreground transition-opacity p-1 shrink-0"
          >
            <HugeiconsIcon icon={DragDropIcon} size={14} />
          </div>
        )}
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              onClick={handleMainClick}
              className={cn(
                "flex-1 transition-all duration-200 relative",
                isCollapsed
                  ? "px-0 justify-center h-11"
                  : "px-3 justify-start h-11 gap-3",
                isActive
                  ? (isCollapsed ? 'text-primary bg-primary/5' : 'bg-primary/10 text-primary hover:bg-primary/15')
                  : 'text-muted-foreground hover:bg-primary/5 hover:text-primary'
              )}
            >
              <div className={cn(
                "shrink-0 transition-transform duration-300",
                isActive ? "scale-105" : "group-hover/item:scale-110",
              )}>
                <HugeiconsIcon icon={item.icon} size={20} />
              </div>
              {!isCollapsed && (
                <>
                  <span className={cn(
                    "font-bold text-[11px] tracking-wider animate-in fade-in slide-in-from-left-1 duration-300 truncate",
                    isActive ? "text-primary" : ""
                  )}>
                    {item.label}
                  </span>
                  {hasSubItems && (
                    <HugeiconsIcon
                      icon={ArrowDown01Icon}
                      size={14}
                      className={cn(
                        "ml-auto transition-transform duration-300",
                        isOpen ? "rotate-180" : ""
                      )}
                    />
                  )}
                </>
              )}
            </Button>
          </TooltipTrigger>
          {isCollapsed && !hasSubItems && (
            <TooltipContent side="right" sideOffset={12} className="font-bold text-[10px] tracking-widest py-1.5 px-3">
              {item.label}
            </TooltipContent>
          )}
        </Tooltip>
      </div>

      {/* Expanded Submenu */}
      {!isCollapsed && hasSubItems && isOpen && (
        <div className="flex flex-col gap-1 ml-9 pl-4 border-l border-border/50 animate-in slide-in-from-top-1 duration-300">
          {item.subItems?.map(sub => (
            <Button
              key={sub.id}
              variant="ghost"
              onClick={() => navigate(sub.path)}
              className={cn(
                "justify-start h-9 px-3 text-[10px] font-bold tracking-widest transition-all",
                location.pathname === sub.path
                  ? "text-primary bg-primary/5"
                  : "text-muted-foreground hover:text-primary hover:bg-primary/5"
              )}
            >
              {sub.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  setIsCollapsed,
  onLogout
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const filteredItems = DEFAULT_MENU_ITEMS.filter(item => {
    const pageId = item.id === 'roles' ? 'roles' : item.id;
    return hasPermission(pageId, 'view');
  });

  const [items, setItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('sidebarOrder');
    if (saved) {
      try {
        const order = JSON.parse(saved) as string[];
        const savedItems = order
          .map(id => filteredItems.find(item => item.id === id))
          .filter((item): item is MenuItem => item !== undefined);

        const newItems = filteredItems.filter(
          item => !order.includes(item.id)
        );

        return [...savedItems, ...newItems];
      } catch {
        return filteredItems;
      }
    }
    return filteredItems;
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);
        localStorage.setItem('sidebarOrder', JSON.stringify(newOrder.map(i => i.id)));
        return newOrder;
      });
    }
  };

  return (
    <aside
      className={cn(
        "border-r border-border bg-background hidden md:flex flex-col transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
        isCollapsed ? "w-14" : "w-60"
      )}
    >
      <div className={cn(
        "h-16 flex items-center transition-all duration-500",
        isCollapsed ? "justify-center px-0" : "justify-between px-6"
      )}>
        {!isCollapsed && (
          <div className="flex items-center gap-2 animate-in fade-in duration-500">
            <div className="h-7 w-7 bg-primary flex items-center justify-center text-primary-foreground font-black text-sm">
              H
            </div>
            <span className="font-black text-base uppercase tracking-tighter">Hospi</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-muted-foreground hover:bg-primary/5 hover:text-primary transition-colors"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <HugeiconsIcon
            icon={isCollapsed ? Menu01Icon : SidebarLeftIcon}
            size={18}
          />
        </Button>
      </div>

      <div className="px-4">
        <Separator className="opacity-40" />
      </div>

      <nav className="flex-1 py-2 space-y-0 overflow-y-auto scrollbar-none">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map(i => i.id)}
            strategy={verticalListSortingStrategy}
          >
            {items.map((item) => (
              <SortableMenuItem
                key={item.id}
                item={item}
                isCollapsed={isCollapsed}
                navigate={navigate}
                location={location}
              />
            ))}
          </SortableContext>
        </DndContext>
      </nav>

      <div className="p-2 mt-auto">
        <Separator className="mb-4 opacity-40 mx-2" />
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full transition-all text-muted-foreground hover:text-destructive hover:bg-destructive/5",
                isCollapsed ? "px-0 justify-center h-11" : "px-3 justify-start h-11 gap-3"
              )}
              onClick={onLogout}
            >
              <HugeiconsIcon icon={Logout01Icon} size={20} />
              {!isCollapsed && (
                <span className="font-bold text-[11px] tracking-wider">
                  Logout
                </span>
              )}
            </Button>
          </TooltipTrigger>
          {isCollapsed && (
            <TooltipContent side="right" sideOffset={12} className="font-bold text-[10px] text-destructive tracking-widest py-1.5 px-3">
              Logout
            </TooltipContent>
          )}
        </Tooltip>
      </div>
    </aside>
  );
};
