import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut,
  ChevronLeft,
  TrendingUp,
  Menu,
  X,
  Sparkles
} from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface SidebarProps {
  isAdmin: boolean;
  userName: string;
  onLogout: () => void;
}

export function Sidebar({ isAdmin, userName, onLogout }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Visão Geral', path: '/dashboard' },
    { icon: ShoppingCart, label: 'Vendas', path: '/vendas' },
    ...(isAdmin ? [
      { icon: Users, label: 'Consultores', path: '/consultores' },
      { icon: Settings, label: 'Configurações', path: '/configuracoes' },
    ] : []),
  ];

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-6 border-b border-sidebar-border">
        <div className="relative">
          <div className="absolute inset-0 gradient-primary rounded-xl blur-lg opacity-50" />
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl gradient-primary">
            <TrendingUp className="h-5 w-5 text-primary-foreground" />
          </div>
        </div>
        {!collapsed && (
          <div className="animate-fade-in">
            <h1 className="font-display font-bold text-lg tracking-tight">Comissões</h1>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Sparkles className="h-2.5 w-2.5" />
              Dashboard Pro
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
              className={cn(
                "group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-300",
                isActive 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                  : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-300",
                isActive 
                  ? "bg-primary/20 text-primary" 
                  : "group-hover:bg-primary/10 group-hover:text-primary"
              )}>
                <item.icon className="h-5 w-5" />
              </div>
              {!collapsed && <span>{item.label}</span>}
              {isActive && !collapsed && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-sidebar-border p-4">
        <div className={cn(
          "flex items-center gap-3 mb-3",
          collapsed && "justify-center"
        )}>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-chart-5/30 rounded-full blur-sm" />
            <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-chart-5/20 text-foreground font-display font-bold">
              {userName.charAt(0).toUpperCase()}
            </div>
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <p className="font-medium text-sm">{userName}</p>
              <p className="text-xs text-muted-foreground">
                {isAdmin ? 'Administrador' : 'Consultor'}
              </p>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size={collapsed ? "icon" : "default"}
          className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-300"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Sair</span>}
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden glass rounded-xl"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-md z-40 lg:hidden animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 z-50 h-full w-72 bg-sidebar/95 backdrop-blur-xl border-r border-sidebar-border flex flex-col transition-transform duration-500 ease-out lg:hidden",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <NavContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className={cn(
        "hidden lg:flex fixed left-0 top-0 h-full bg-sidebar/80 backdrop-blur-xl border-r border-sidebar-border flex-col transition-all duration-500 ease-out z-30",
        collapsed ? "w-20" : "w-64"
      )}>
        <NavContent />
        
        {/* Collapse button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-20 h-6 w-6 rounded-full border border-sidebar-border bg-sidebar hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
          onClick={() => setCollapsed(!collapsed)}
        >
          <ChevronLeft className={cn(
            "h-4 w-4 transition-transform duration-300",
            collapsed && "rotate-180"
          )} />
        </Button>
      </aside>
    </>
  );
}
