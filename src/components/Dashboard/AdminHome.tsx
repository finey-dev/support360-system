
import { useAuth } from "@/components/Auth/AuthContext";
import { PageHeader } from "@/components/Layout/PageHeader";
import { StatsCard } from "@/components/Dashboard/StatsCard";
import { TicketTable } from "@/components/Tickets/TicketTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Inbox, Clock, CheckCircle, Settings, BarChart3, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

export const AdminHome = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 animate-in">
      <PageHeader 
        title={`Welcome back, ${user?.name?.split(' ')[0] || 'Admin'}!`} 
        description="Here's an overview of your support system"
        actions={
          <div className="flex gap-2">
            <Link to="/dashboard/agents/new">
              <Button variant="outline" className="space-x-2">
                <UserPlus size={16} />
                <span>Add Agent</span>
              </Button>
            </Link>
            <Link to="/dashboard/settings">
              <Button variant="outline" className="space-x-2">
                <Settings size={16} />
                <span>Settings</span>
              </Button>
            </Link>
          </div>
        }
      />

      {/* Global stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Users"
          value="253"
          icon={<Users size={20} />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Open Tickets"
          value="38"
          icon={<Inbox size={20} />}
          trend={{ value: 5, isPositive: false }}
        />
        <StatsCard
          title="Avg. Resolution Time"
          value="1.8d"
          icon={<Clock size={20} />}
          trend={{ value: 15, isPositive: true }}
        />
        <StatsCard
          title="Resolution Rate"
          value="94%"
          icon={<CheckCircle size={20} />}
          trend={{ value: 2, isPositive: true }}
        />
      </div>
      
      {/* System status and performance */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>System Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Customer Satisfaction</span>
                <span className="text-sm font-medium">4.7/5</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full">
                <div className="h-2 bg-support-500 rounded-full" style={{ width: "94%" }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">First Contact Resolution</span>
                <span className="text-sm font-medium">72%</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full">
                <div className="h-2 bg-support-500 rounded-full" style={{ width: "72%" }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Agent Utilization</span>
                <span className="text-sm font-medium">86%</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full">
                <div className="h-2 bg-support-500 rounded-full" style={{ width: "86%" }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Chatbot Deflection Rate</span>
                <span className="text-sm font-medium">42%</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full">
                <div className="h-2 bg-support-500 rounded-full" style={{ width: "42%" }}></div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Link to="/dashboard/analytics">
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <span>Detailed Analytics</span>
                  <BarChart3 size={14} />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Team Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <div className="text-xl font-bold">50</div>
                <div className="text-xs text-muted-foreground">Active Agents</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <div className="text-xl font-bold">23</div>
                <div className="text-xs text-muted-foreground">Online Now</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <div className="text-xl font-bold">18m</div>
                <div className="text-xs text-muted-foreground">Avg. Response</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <div className="text-xl font-bold">92%</div>
                <div className="text-xs text-muted-foreground">SLA Compliance</div>
              </div>
            </div>
            
            <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-between">
              <Link to="/dashboard/agents">
                <Button variant="outline" size="sm">
                  <Users size={14} className="mr-1" />
                  Manage Agents
                </Button>
              </Link>
              <Link to="/dashboard/customers">
                <Button variant="outline" size="sm">
                  <Users size={14} className="mr-1" />
                  Manage Customers
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent tickets */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Tickets</h2>
          <Link to="/dashboard/tickets">
            <Button variant="ghost" size="sm">View all tickets</Button>
          </Link>
        </div>
        <TicketTable limit={5} />
      </div>
    </div>
  );
};
