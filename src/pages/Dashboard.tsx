
import { useEffect } from "react";
import { useNavigate, useLocation, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { CustomerHome } from "@/components/Dashboard/CustomerHome";
import { AgentHome } from "@/components/Dashboard/AgentHome";
import { AdminHome } from "@/components/Dashboard/AdminHome";
import { useAuth } from "@/components/Auth/AuthContext";
import { ChatInterface } from "@/components/Chat/ChatInterface";
import { TicketTable } from "@/components/Tickets/TicketTable";
import { PageHeader } from "@/components/Layout/PageHeader";

const DashboardHome = () => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  switch (user.role) {
    case "customer":
      return <CustomerHome />;
    case "agent":
      return <AgentHome />;
    case "admin":
      return <AdminHome />;
    default:
      return <div>Unknown role</div>;
  }
};

const DashboardTickets = () => {
  return (
    <div className="space-y-6 animate-in">
      <PageHeader 
        title="Tickets" 
        description="View and manage all support tickets"
      />
      <TicketTable />
    </div>
  );
};

const DashboardChat = () => {
  return <ChatInterface />;
};

// Placeholder components for other routes
const Analytics = () => (
  <div className="space-y-6 animate-in">
    <PageHeader title="Analytics" description="Support performance metrics and insights" />
    <div className="bg-muted p-8 rounded-lg text-center">Analytics dashboard content placeholder</div>
  </div>
);

const KnowledgeBase = () => (
  <div className="space-y-6 animate-in">
    <PageHeader title="Knowledge Base" description="Find answers to common questions" />
    <div className="bg-muted p-8 rounded-lg text-center">Knowledge Base content placeholder</div>
  </div>
);

const ManageCustomers = () => (
  <div className="space-y-6 animate-in">
    <PageHeader title="Manage Customers" description="View and edit customer accounts" />
    <div className="bg-muted p-8 rounded-lg text-center">Customer management interface placeholder</div>
  </div>
);

const ManageAgents = () => (
  <div className="space-y-6 animate-in">
    <PageHeader title="Manage Agents" description="View and edit support agent accounts" />
    <div className="bg-muted p-8 rounded-lg text-center">Agent management interface placeholder</div>
  </div>
);

const Settings = () => (
  <div className="space-y-6 animate-in">
    <PageHeader title="System Settings" description="Configure your support center" />
    <div className="bg-muted p-8 rounded-lg text-center">Settings interface placeholder</div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Redirect to proper dashboard path if just /dashboard is accessed
  useEffect(() => {
    if (location.pathname === "/dashboard") {
      navigate("/dashboard/home");
    }
  }, [location.pathname, navigate]);
  
  // Role-based route guard
  const guardedRoute = (Component: React.ComponentType, allowedRoles: string[]) => {
    if (!user || !allowedRoles.includes(user.role)) {
      return <div>Access denied. You do not have permission to view this page.</div>;
    }
    return <Component />;
  };

  return (
    <DashboardLayout>
      <Routes>
        <Route path="home" element={<DashboardHome />} />
        <Route path="chat" element={<ChatInterface />} />
        <Route path="tickets" element={<DashboardTickets />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="knowledge-base" element={<KnowledgeBase />} />
        <Route path="customers" element={guardedRoute(ManageCustomers, ["admin"])} />
        <Route path="agents" element={guardedRoute(ManageAgents, ["admin"])} />
        <Route path="settings" element={guardedRoute(Settings, ["admin"])} />
      </Routes>
    </DashboardLayout>
  );
};

export default Dashboard;
