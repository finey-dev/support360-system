
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
import { TicketDetail } from "@/components/Tickets/TicketDetail";
import { KanbanBoard } from "@/components/Tickets/KanbanBoard";
import { KnowledgeBase } from "@/components/KnowledgeBase/KnowledgeBase";
import { AnalyticsDashboard } from "@/components/Analytics/AnalyticsDashboard";
import { ManageUsers } from "@/components/Users/ManageUsers";
import { SystemSettings } from "@/components/Settings/SystemSettings";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { ArticleDetail } from "@/components/KnowledgeBase/ArticleDetail";
import { NewTicket } from "@/components/Tickets/NewTicket";

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
        actions={
          <Button asChild>
            <Link to="/dashboard/tickets/new">New Ticket</Link>
          </Button>
        }
      />
      
      <Tabs defaultValue="table" className="space-y-6">
        <TabsList>
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
        </TabsList>
        
        <TabsContent value="table">
          <TicketTable />
        </TabsContent>
        
        <TabsContent value="kanban">
          <KanbanBoard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const DashboardTicketDetail = () => {
  return <TicketDetail />;
};

const DashboardChat = () => {
  return <ChatInterface />;
};

const DashboardAnalytics = () => {
  return <AnalyticsDashboard />;
};

const DashboardKnowledgeBase = () => {
  return <KnowledgeBase />;
};

const DashboardManageCustomers = () => {
  return <ManageUsers type="customers" />;
};

const DashboardManageAgents = () => {
  return <ManageUsers type="agents" />;
};

const DashboardSettings = () => {
  return <SystemSettings />;
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    if (location.pathname === "/dashboard") {
      navigate("/dashboard/home");
    }
  }, [location.pathname, navigate]);
  
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
        <Route path="tickets/new" element={<NewTicket />} />
        <Route path="tickets/:ticketId" element={<DashboardTicketDetail />} />
        <Route path="analytics" element={<DashboardAnalytics />} />
        <Route path="knowledge-base" element={<DashboardKnowledgeBase />} />
        <Route path="knowledge-base/:articleId" element={<ArticleDetail />} />
        <Route path="customers" element={guardedRoute(DashboardManageCustomers, ["admin", "agent"])} />
        <Route path="agents" element={guardedRoute(DashboardManageAgents, ["admin"])} />
        <Route path="settings" element={guardedRoute(DashboardSettings, ["admin"])} />
      </Routes>
    </DashboardLayout>
  );
};

export default Dashboard;
