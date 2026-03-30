import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  FolderKanban,
  HandCoins,
  Calendar,
  FileBarChart,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';
import { Logo } from './Logo';
import { useAuthStore } from '../shared/stores';
import { UserRole } from '../shared/types';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: 'all' as const },
  { name: 'Voluntarios', href: '/volunteers', icon: Users, roles: 'all' as const },
  { name: 'Doadores', href: '/donors', icon: UserCheck, roles: 'all' as const },
  { name: 'Doacoes', href: '/donations', icon: HandCoins, roles: 'all' as const },
  { name: 'Projetos', href: '/projects', icon: FolderKanban, roles: 'all' as const },
  { name: 'Eventos', href: '/events', icon: Calendar, roles: 'all' as const },
  { name: 'Relatorios', href: '/reports', icon: FileBarChart, roles: [UserRole.ADMIN] },
  { name: 'Configuracoes', href: '/settings', icon: Settings, roles: [UserRole.ADMIN] },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const filteredNav = navigation.filter((item) => {
    if (item.roles === 'all') return true;
    return item.roles.includes(user?.role as UserRole);
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={clsx('px-4 py-6 border-b border-white/10', collapsed && 'px-3')}>
        <Logo collapsed={collapsed} variant="light" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {filteredNav.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-sidebar-text hover:bg-sidebar-hover hover:text-white',
                collapsed && 'justify-center px-2'
              )
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
            {!collapsed && <span>{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div className={clsx('px-3 pb-4 space-y-2 border-t border-white/10 pt-4', collapsed && 'px-2')}>
        {/* User info */}
        {!collapsed && user && (
          <div className="px-3 py-3 rounded-lg bg-white/5">
            <p className="text-sm font-medium text-white truncate">{user.name}</p>
            <p className="text-xs text-sidebar-text truncate">{user.email}</p>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          aria-label="Sair"
          title="Sair"
          className={clsx(
            'flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-text hover:bg-sidebar-hover hover:text-white transition-all duration-200',
            collapsed && 'justify-center px-2'
          )}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
          {!collapsed && <span>Sair</span>}
        </button>

        {/* Collapse toggle (desktop only) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
          title={collapsed ? 'Expandir menu' : 'Recolher menu'}
          className="hidden lg:flex items-center justify-center w-full py-2 rounded-lg text-sidebar-text hover:bg-sidebar-hover hover:text-white transition-all"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          ) : (
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        aria-label="Abrir menu"
        title="Abrir menu"
        className="lg:hidden fixed top-4 left-4 z-40 p-2 rounded-lg bg-black text-white shadow-lg"
      >
        <Menu className="w-5 h-5" aria-hidden="true" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-sidebar-bg shadow-sidebar">
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Fechar menu"
              title="Fechar menu"
              className="absolute top-4 right-4 p-1 rounded-lg text-white/70 hover:text-white"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside
        className={clsx(
          'hidden lg:flex flex-col bg-sidebar-bg shadow-sidebar transition-all duration-300',
          collapsed ? 'w-[72px]' : 'w-64'
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
