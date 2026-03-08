import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { NavLink } from '@/components/NavLink';
import { useLocation } from 'react-router-dom';
import { Bot, AlertTriangle, GitBranch, BookOpen, Shield, FlaskConical, Menu } from 'lucide-react';

const navItems = [
  { title: 'Command Center', url: '/', icon: Bot },
  { title: 'Active Alerts', url: '/alerts', icon: AlertTriangle },
  { title: 'Signal Convergence', url: '/convergence', icon: GitBranch },
  { title: 'Agent Registry', url: '/registry', icon: BookOpen },
  { title: 'Governance', url: '/governance', icon: Shield },
  { title: 'Sandbox', url: '/sandbox', icon: FlaskConical },
];

function AppSidebarContent() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent>
        <div className={`px-4 py-4 ${collapsed ? 'px-2' : ''}`}>
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-primary/20 flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-foreground tracking-tight">ATLAS</h2>
                <p className="text-[10px] text-muted-foreground">Monitoring Agents</p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="w-7 h-7 rounded bg-primary/20 flex items-center justify-center mx-auto">
              <Bot className="w-4 h-4 text-primary" />
            </div>
          )}
        </div>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-widest">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === '/'}
                      className="hover:bg-muted/50"
                      activeClassName="bg-muted text-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebarContent />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-11 flex items-center border-b border-border px-3 shrink-0">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <span className="ml-3 text-xs text-muted-foreground font-mono">
              {new Date().toLocaleTimeString()} UTC
            </span>
            <div className="ml-auto flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-atlas-success animate-pulse-glow" />
              <span className="text-[10px] text-muted-foreground">System Online</span>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto atlas-scrollbar">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
