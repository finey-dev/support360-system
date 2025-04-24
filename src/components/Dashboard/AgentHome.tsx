
import { useAuth } from "@/components/Auth/AuthContext";
import { PageHeader } from "@/components/Layout/PageHeader";
import { StatsCard } from "@/components/Dashboard/StatsCard";
import { TicketTable } from "@/components/Tickets/TicketTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Inbox, Clock, CheckCircle, Bell, BarChart3, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const AgentHome = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 animate-in">
      <PageHeader 
        title={`Welcome back, ${user?.name?.split(' ')[0] || 'Agent'}!`} 
        description="Here's an overview of your assigned tickets and activities"
      />

      {/* Quick stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Assigned Tickets"
          value="14"
          icon={<Inbox size={20} />}
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Waiting Response"
          value="3"
          icon={<Bell size={20} />}
          trend={{ value: 8, isPositive: false }}
        />
        <StatsCard
          title="First Response Time"
          value="1.2h"
          icon={<Clock size={20} />}
          trend={{ value: 15, isPositive: true }}
        />
        <StatsCard
          title="Resolved Today"
          value="6"
          icon={<CheckCircle size={20} />}
          trend={{ value: 12, isPositive: true }}
        />
      </div>
      
      {/* Tabs for tickets and chat handoffs */}
      <Tabs defaultValue="tickets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tickets">My Tickets</TabsTrigger>
          <TabsTrigger value="handoffs">Chat Handoffs (2)</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tickets" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Assigned Tickets</h2>
            <Link to="/dashboard/tickets">
              <Button variant="ghost" size="sm">View all tickets</Button>
            </Link>
          </div>
          <TicketTable limit={5} />
        </TabsContent>
        
        <TabsContent value="handoffs" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Chat Escalations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Jane Cooper</span>
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">Urgent</span>
                      </div>
                      <p className="text-muted-foreground text-sm mt-1">
                        I've been waiting for a refund for 2 weeks and getting no updates...
                      </p>
                      <div className="text-xs text-muted-foreground mt-2">Escalated 14 minutes ago</div>
                    </div>
                    <Link to="/dashboard/chat/1">
                      <Button size="sm" variant="outline">
                        <span>View</span>
                        <ArrowRight size={14} className="ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Alex Morgan</span>
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">Medium</span>
                      </div>
                      <p className="text-muted-foreground text-sm mt-1">
                        I need to speak with someone about upgrading my account but the chatbot...
                      </p>
                      <div className="text-xs text-muted-foreground mt-2">Escalated 43 minutes ago</div>
                    </div>
                    <Link to="/dashboard/chat/2">
                      <Button size="sm" variant="outline">
                        <span>View</span>
                        <ArrowRight size={14} className="ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Team performance and KB */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Team Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">First Contact Resolution</span>
                <span className="text-sm font-medium">72%</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full">
                <div className="h-2 bg-support-500 rounded-full" style={{ width: "72%" }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Average Handle Time</span>
                <span className="text-sm font-medium">2.3 hours</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full">
                <div className="h-2 bg-support-500 rounded-full" style={{ width: "65%" }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Customer Satisfaction</span>
                <span className="text-sm font-medium">4.7/5</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full">
                <div className="h-2 bg-support-500 rounded-full" style={{ width: "94%" }}></div>
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
            <CardTitle>Agent Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link to="/dashboard/knowledge-base/10" className="block p-3 rounded-md hover:bg-accent">
                <h3 className="font-medium">Escalation Protocol</h3>
                <p className="text-sm text-muted-foreground">When and how to escalate customer issues</p>
                <div className="text-xs mt-1 text-muted-foreground italic">Agent-only resource</div>
              </Link>
              
              <Link to="/dashboard/knowledge-base/11" className="block p-3 rounded-md hover:bg-accent">
                <h3 className="font-medium">Refund Handling Guidelines</h3>
                <p className="text-sm text-muted-foreground">Updated procedures for processing refunds</p>
                <div className="text-xs mt-1 text-muted-foreground italic">Agent-only resource</div>
              </Link>
              
              <Link to="/dashboard/knowledge-base/12" className="block p-3 rounded-md hover:bg-accent">
                <h3 className="font-medium">Product Updates - July 2023</h3>
                <p className="text-sm text-muted-foreground">Overview of recent changes and features</p>
              </Link>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <Link to="/dashboard/knowledge-base">
                <Button variant="outline" className="w-full">View Knowledge Base</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
