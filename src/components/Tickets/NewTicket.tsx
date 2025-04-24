
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/Layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/Auth/AuthContext";
import { createTicket } from "@/lib/db";
import { ArrowLeft } from "lucide-react";

export const NewTicket = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({
    subject: "",
    description: "",
    priority: "medium"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const ticket = createTicket({
        subject: form.subject,
        description: form.description,
        priority: form.priority as 'low' | 'medium' | 'high' | 'urgent',
        status: 'open',
        userId: user.id,
        assignedToId: null
      });

      toast({
        title: "Ticket created",
        description: "Your ticket has been successfully created."
      });

      navigate(`/dashboard/tickets/${ticket.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create ticket. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create New Ticket"
        description="Submit a new support ticket"
        actions={
          <Button variant="outline" onClick={() => navigate('/dashboard/tickets')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tickets
          </Button>
        }
      />

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <Input
                value={form.subject}
                onChange={e => setForm({ ...form, subject: e.target.value })}
                placeholder="Brief description of the issue"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Textarea
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Detailed description of the issue"
                rows={5}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Priority</label>
              <Select
                value={form.priority}
                onValueChange={value => setForm({ ...form, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4">
              <Button type="submit">Create Ticket</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
