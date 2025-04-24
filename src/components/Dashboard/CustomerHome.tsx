
import { useAuth } from "@/components/Auth/AuthContext";
import { PageHeader } from "@/components/Layout/PageHeader";
import { StatsCard } from "@/components/Dashboard/StatsCard";
import { TicketTable } from "@/components/Tickets/TicketTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Inbox, Clock, CheckCircle, Plus } from "lucide-react";
import { Link } from "react-router-dom";

export const CustomerHome = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 animate-in">
      <PageHeader 
        title={`Welcome back, ${user?.name?.split(' ')[0] || 'User'}!`} 
        description="Here's an overview of your support activity"
        actions={
          <Link to="/dashboard/tickets/new">
            <Button className="space-x-2">
              <Plus size={16} />
              <span>New Ticket</span>
            </Button>
          </Link>
        }
      />

      {/* Quick stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Active Tickets"
          value="3"
          icon={<Inbox size={20} />}
          trend={{ value: 12, isPositive: false }}
        />
        <StatsCard
          title="Chat Sessions"
          value="8"
          icon={<MessageSquare size={20} />}
          trend={{ value: 23, isPositive: true }}
        />
        <StatsCard
          title="Avg. Response Time"
          value="2.5h"
          icon={<Clock size={20} />}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Resolved Issues"
          value="12"
          icon={<CheckCircle size={20} />}
          trend={{ value: 10, isPositive: true }}
        />
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
      
      {/* Quick help and KB */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Need immediate assistance?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Our AI assistant can help answer your questions instantly. Try it now!
            </p>
            <Link to="/dashboard/chat">
              <Button className="w-full">
                <MessageSquare className="mr-2 h-4 w-4" />
                Start a Chat
              </Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Recommended Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link to="/dashboard/knowledge-base/1" className="block p-3 rounded-md hover:bg-accent">
                <h3 className="font-medium">How to reset your password</h3>
                <p className="text-sm text-muted-foreground">Learn how to change or reset your account password</p>
              </Link>
              <Link to="/dashboard/knowledge-base/2" className="block p-3 rounded-md hover:bg-accent">
                <h3 className="font-medium">Getting started with our product</h3>
                <p className="text-sm text-muted-foreground">A complete beginner's guide to our platform</p>
              </Link>
              <Link to="/dashboard/knowledge-base/3" className="block p-3 rounded-md hover:bg-accent">
                <h3 className="font-medium">Billing and payment FAQ</h3>
                <p className="text-sm text-muted-foreground">Answers to common questions about billing</p>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
