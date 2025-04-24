
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/Layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTickets, getUsers } from "@/lib/db";
import { useAuth } from "@/components/Auth/AuthContext";
import { TicketStatusChart } from "./TicketStatusChart";
import { TicketPriorityChart } from "./TicketPriorityChart";
import { TicketTrendChart } from "./TicketTrendChart";
import { AgentPerformanceChart } from "./AgentPerformanceChart";
import { CustomerSatisfactionChart } from "./CustomerSatisfactionChart";
import { ResponseTimeChart } from "./ResponseTimeChart";

export const AnalyticsDashboard = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!user) return;
    
    // Get tickets based on user role
    let filteredTickets;
    if (user.role === 'customer') {
      filteredTickets = getTickets({ userId: user.id });
    } else if (user.role === 'agent') {
      filteredTickets = getTickets({ assignedToId: user.id });
    } else {
      filteredTickets = getTickets();
    }
    
    // Get agents for admin dashboards
    const agentUsers = user.role === 'admin' ? getUsers('agent') : [];
    
    setTickets(filteredTickets);
    setAgents(agentUsers);
    setLoading(false);
  }, [user]);
  
  // Statistics
  const totalTickets = tickets.length;
  const openTickets = tickets.filter(t => t.status === 'open').length;
  const inProgressTickets = tickets.filter(t => t.status === 'in_progress').length;
  const resolvedTickets = tickets.filter(t => t.status === 'resolved').length;
  const closedTickets = tickets.filter(t => t.status === 'closed').length;
  
  const urgentTickets = tickets.filter(t => t.priority === 'urgent').length;
  const highTickets = tickets.filter(t => t.priority === 'high').length;
  
  // Average resolution time (in days)
  const calculateAvgResolutionTime = () => {
    const resolvedTicketsList = tickets.filter(t => t.status === 'resolved' || t.status === 'closed');
    if (resolvedTicketsList.length === 0) return 0;
    
    const totalResolutionTime = resolvedTicketsList.reduce((acc, ticket) => {
      const createdDate = new Date(ticket.createdAt);
      const updatedDate = new Date(ticket.updatedAt);
      const diffTime = Math.abs(updatedDate.getTime() - createdDate.getTime());
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      return acc + diffDays;
    }, 0);
    
    return parseFloat((totalResolutionTime / resolvedTicketsList.length).toFixed(1));
  };
  
  const avgResolutionTime = calculateAvgResolutionTime();
  
  // Resolution rate
  const resolutionRate = totalTickets > 0 
    ? parseFloat((((resolvedTickets + closedTickets) / totalTickets) * 100).toFixed(1))
    : 0;
  
  if (loading) {
    return (
      <div className="space-y-6 animate-in">
        <div className="animate-pulse h-10 bg-gray-200 rounded w-1/3"></div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse h-64 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in">
      <PageHeader
        title="Analytics Dashboard"
        description="Visualize support metrics and performance indicators"
        actions={
          <div className="flex gap-2">
            <Tabs defaultValue="weekly" onValueChange={(value) => setTimeframe(value as any)}>
              <TabsList>
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        }
      />
      
      {/* Key metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTickets}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {openTickets} open, {inProgressTickets} in progress
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resolutionRate}%</div>
            <div className="text-xs text-muted-foreground mt-1">
              {resolvedTickets + closedTickets} of {totalTickets} tickets resolved
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Resolution Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgResolutionTime} days</div>
            <div className="text-xs text-muted-foreground mt-1">
              From creation to resolution
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{urgentTickets + highTickets}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {urgentTickets} urgent, {highTickets} high
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ticket Distribution</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <TicketStatusChart tickets={tickets} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Ticket Priorities</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <TicketPriorityChart tickets={tickets} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Ticket Volume Trend</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <TicketTrendChart tickets={tickets} timeframe={timeframe} />
          </CardContent>
        </Card>
        
        {user?.role === 'admin' && (
          <Card>
            <CardHeader>
              <CardTitle>Agent Performance</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <AgentPerformanceChart tickets={tickets} agents={agents} />
            </CardContent>
          </Card>
        )}
        
        <Card>
          <CardHeader>
            <CardTitle>Customer Satisfaction</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <CustomerSatisfactionChart tickets={tickets} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Response Time</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <ResponseTimeChart tickets={tickets} timeframe={timeframe} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
