
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/components/Auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { 
  MessageSquare, 
  Inbox, 
  BarChart3, 
  Book, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Home 
} from "lucide-react";

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  
  const toggleSidebar = () => setIsOpen(!isOpen);
  
  // Navigation items based on user role
  const navItems = [
    { label: "Dashboard", icon: <Home size={20} />, path: "/dashboard", roles: ["customer", "agent", "admin"] },
    { label: "Chat", icon: <MessageSquare size={20} />, path: "/dashboard/chat", roles: ["customer", "agent", "admin"] },
    { label: "Tickets", icon: <Inbox size={20} />, path: "/dashboard/tickets", roles: ["customer", "agent", "admin"] },
    { label: "Analytics", icon: <BarChart3 size={20} />, path: "/dashboard/analytics", roles: ["customer", "agent", "admin"] },
    { label: "Knowledge Base", icon: <Book size={20} />, path: "/dashboard/knowledge-base", roles: ["customer", "agent", "admin"] },
    { label: "Customers", icon: <Users size={20} />, path: "/dashboard/customers", roles: ["admin"] },
    { label: "Agents", icon: <Users size={20} />, path: "/dashboard/agents", roles: ["admin"] },
    { label: "Settings", icon: <Settings size={20} />, path: "/dashboard/settings", roles: ["admin"] },
  ];
  
  // Filter navigation items based on user role
  const filteredNavItems = navItems.filter(item => user && item.roles.includes(user.role));

  return (
    <>
      {/* Mobile Sidebar Toggle Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="icon" onClick={toggleSidebar}>
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>
      
      {/* Sidebar */}
      <aside className={`bg-sidebar border-r border-sidebar-border fixed inset-y-0 left-0 z-40 w-64 transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="px-6 py-4 border-b border-sidebar-border flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="bg-support-600 text-white p-1.5 rounded">
                <MessageSquare size={18} />
              </div>
              <span className="text-xl font-bold">HelpDesk</span>
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden" 
              onClick={toggleSidebar}
            >
              <X size={20} />
            </Button>
          </div>
          
          {/* User profile */}
          <div className="px-6 py-4 border-b border-sidebar-border">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                <AvatarFallback>{user?.name ? getInitials(user.name) : 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
            <div className="mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-support-100 text-support-800 capitalize">
                {user?.role}
              </span>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {filteredNavItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path} 
                className={`flex items-center px-3 py-2 text-sm rounded-md ${location.pathname === item.path ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : 'text-sidebar-foreground hover:bg-sidebar-accent/50'}`}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </Link>
            ))}
          </nav>
          
          {/* Logout */}
          <div className="px-3 py-4 border-t border-sidebar-border">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-sm text-sidebar-foreground hover:bg-sidebar-accent/50"
              onClick={logout}
            >
              <LogOut size={20} className="mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </aside>
      
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};
