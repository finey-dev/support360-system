
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  getTicket, 
  getTicketMessages, 
  getTicketComments,
  getUser, 
  createMessage, 
  updateTicket,
  getAvailableAgents 
} from "@/lib/db";
import { PageHeader } from "@/components/Layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  MessageSquare, 
  Send, 
  AlertCircle, 
  Clock, 
  CheckCircle, 
  XCircle,
  Users
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/components/Auth/AuthContext";
import { getInitials, getRelativeTime } from "@/lib/utils";
import { TicketComment } from "./TicketComment";

export const TicketDetail = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [ticket, setTicket] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [availableAgents, setAvailableAgents] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    if (ticketId) {
      const id = parseInt(ticketId);
      const ticketData = getTicket(id);
      if (!ticketData) {
        navigate('/dashboard/tickets');
        return;
      }
      
      // Add user data to ticket
      const ticketCreator = getUser(ticketData.userId);
      const assignedAgent = ticketData.assignedToId ? getUser(ticketData.assignedToId) : null;
      
      setTicket({
        ...ticketData,
        user: ticketCreator,
        assignedToUser: assignedAgent
      });
      
      // Get messages
      const ticketMessages = getTicketMessages(id);
      const enhancedMessages = ticketMessages.map(message => {
        const messageUser = getUser(message.userId);
        return {
          ...message,
          user: messageUser
        };
      });
      setMessages(enhancedMessages);
      
      // Get comments
      const ticketComments = getTicketComments(id);
      const enhancedComments = ticketComments.map(comment => {
        const commentUser = getUser(comment.userId);
        return {
          ...comment,
          user: commentUser
        };
      });
      setComments(enhancedComments);
      
      // Get available agents for assignment
      const agents = getAvailableAgents();
      setAvailableAgents(agents);
      
      setLoading(false);
    }
  }, [ticketId, navigate]);
  
  const handleSubmitMessage = () => {
    if (!newMessage.trim() || !user || !ticket) return;
    
    setSubmitting(true);
    
    try {
      const createdMessage = createMessage({
        content: newMessage,
        ticketId: ticket.id,
        userId: user.id,
        isAi: false
      });
      
      // Add user data to new message
      const messageWithUser = {
        ...createdMessage,
        user: {
          id: user.id,
          name: user.name,
          avatarUrl: user.avatarUrl
        }
      };
      
      setMessages([...messages, messageWithUser]);
      setNewMessage("");
      
      if (ticket.status === 'closed') {
        updateTicket(ticket.id, { status: 'open' });
        setTicket({ ...ticket, status: 'open' });
        toast({
          title: "Ticket reopened",
          description: "This ticket has been automatically reopened.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleUpdateStatus = (status: string) => {
    if (!ticket) return;
    
    try {
      updateTicket(ticket.id, { status: status as any });
      setTicket({ ...ticket, status });
      toast({
        title: "Status updated",
        description: `Ticket status has been updated to ${status.replace('_', ' ')}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status.",
        variant: "destructive",
      });
    }
  };
  
  const handleUpdatePriority = (priority: string) => {
    if (!ticket) return;
    
    try {
      updateTicket(ticket.id, { priority: priority as any });
      setTicket({ ...ticket, priority });
      toast({
        title: "Priority updated",
        description: `Ticket priority has been updated to ${priority}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update priority.",
        variant: "destructive",
      });
    }
  };

  const handleAssignTicket = (agentId: string) => {
    if (!ticket) return;
    
    const assignedToId = parseInt(agentId);
    
    try {
      updateTicket(ticket.id, { assignedToId });
      
      // Update the agent information in the current ticket state
      const assignedAgent = getUser(assignedToId);
      
      setTicket({ 
        ...ticket, 
        assignedToId,
        assignedToUser: assignedAgent 
      });
      
      toast({
        title: "Ticket assigned",
        description: `Ticket has been assigned to ${assignedAgent.name}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign ticket.",
        variant: "destructive",
      });
    }
  };
  
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse h-10 bg-gray-200 rounded w-1/3"></div>
        <div className="animate-pulse h-32 bg-gray-200 rounded"></div>
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }
  
  if (!ticket) return null;
  
  const statusColors: Record<string, string> = {
    open: "bg-yellow-100 text-yellow-800",
    in_progress: "bg-blue-100 text-blue-800",
    resolved: "bg-green-100 text-green-800",
    closed: "bg-gray-100 text-gray-800",
  };
  
  const priorityColors: Record<string, string> = {
    low: "bg-blue-50 text-blue-600",
    medium: "bg-yellow-50 text-yellow-600",
    high: "bg-orange-50 text-orange-600",
    urgent: "bg-red-50 text-red-600",
  };
  
  const canManageTicket = user && (user.role === 'admin' || 
    (user.role === 'agent' && ticket.assignedToId === user.id));
  
  const isAdmin = user && user.role === 'admin';

  return (
    <div className="space-y-6 animate-in">
      <PageHeader 
        title={`Ticket #${ticket.id.toString().padStart(4, '0')}`}
        description={ticket.subject}
        actions={
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard/tickets')}
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Tickets
            </Button>
          </div>
        }
      />
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          {/* Ticket info */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-medium">{ticket.subject}</h3>
                    <p className="text-muted-foreground text-sm mt-1">{ticket.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className={statusColors[ticket.status]}>
                      {ticket.status.replace('_', ' ')}
                    </Badge>
                    <Badge variant="outline" className={priorityColors[ticket.priority]}>
                      {ticket.priority}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Clock size={16} className="mr-1" />
                    <span>Created {getRelativeTime(ticket.createdAt)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock size={16} className="mr-1" />
                    <span>Updated {getRelativeTime(ticket.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Messages */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Conversation</h3>
            <div className="space-y-4">
              {messages.map((message) => (
                <Card key={message.id} className={message.isAi ? "border-support-200 bg-support-50/50" : ""}>
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={message.user?.avatarUrl} alt={message.user?.name} />
                        <AvatarFallback>{getInitials(message.user?.name || '')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <p className="text-sm font-medium">
                              {message.user?.name}
                              {message.isAi && <span className="ml-2 text-xs bg-support-100 text-support-800 px-1.5 py-0.5 rounded-full">AI Assistant</span>}
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {getRelativeTime(message.createdAt)}
                          </p>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {messages.length === 0 && (
                <div className="text-center py-8 border rounded-md">
                  <MessageSquare className="mx-auto h-10 w-10 text-muted-foreground/50" />
                  <p className="mt-2 text-muted-foreground">No messages yet</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Reply form */}
          {ticket.status !== 'closed' && (
            <div className="space-y-4">
              <div className="flex items-center">
                <h3 className="text-lg font-medium">Reply</h3>
              </div>
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message here..."
                className="min-h-[120px]"
              />
              <div className="flex justify-end">
                <Button 
                  onClick={handleSubmitMessage} 
                  disabled={!newMessage.trim() || submitting}
                >
                  <Send size={16} className="mr-2" />
                  Send Reply
                </Button>
              </div>
            </div>
          )}
          
          {ticket.status === 'closed' && (
            <Card className="bg-muted/50">
              <CardContent className="py-4 flex items-center justify-center gap-2 text-muted-foreground">
                <XCircle size={16} />
                <span>This ticket is closed. Reply to reopen it.</span>
              </CardContent>
            </Card>
          )}
          
          {/* Comments Section */}
          <TicketComment ticketId={ticket.id} initialComments={comments} />
        </div>
        
        {/* Sidebar with ticket info */}
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-6">
              {/* Admin Assignment Section */}
              {isAdmin && (
                <div className="space-y-2 pb-4 border-b">
                  <h4 className="text-sm font-medium">Assign Ticket</h4>
                  <Select
                    value={ticket.assignedToId ? ticket.assignedToId.toString() : ""}
                    onValueChange={handleAssignTicket}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select agent" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableAgents.map((agent: any) => (
                        <SelectItem key={agent.id} value={agent.id.toString()}>
                          {agent.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {/* Status and Priority */}
              {canManageTicket ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Status</h4>
                    <Select
                      value={ticket.status}
                      onValueChange={handleUpdateStatus}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Priority</h4>
                    <Select
                      value={ticket.priority}
                      onValueChange={handleUpdatePriority}
                    >
                      <SelectTrigger className="w-full">
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
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium">Status</h4>
                    <div className="text-sm">
                      <Badge variant="outline" className={statusColors[ticket.status]}>
                        {ticket.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium">Priority</h4>
                    <div className="text-sm">
                      <Badge variant="outline" className={priorityColors[ticket.priority]}>
                        {ticket.priority}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Submitted by */}
              <div className="space-y-2 pt-2 border-t">
                <h4 className="text-sm font-medium">Submitted by</h4>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={ticket.user?.avatarUrl} alt={ticket.user?.name} />
                    <AvatarFallback>{getInitials(ticket.user?.name || '')}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{ticket.user?.name}</span>
                </div>
              </div>
              
              {/* Assigned to */}
              <div className="space-y-2 pt-2 border-t">
                <h4 className="text-sm font-medium">Assigned to</h4>
                {ticket.assignedToUser ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={ticket.assignedToUser?.avatarUrl} alt={ticket.assignedToUser?.name} />
                      <AvatarFallback>{getInitials(ticket.assignedToUser?.name || '')}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{ticket.assignedToUser?.name}</span>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Unassigned</p>
                )}
              </div>
              
              {/* Related articles */}
              <div className="space-y-2 pt-2 border-t">
                <h4 className="text-sm font-medium">Related KB Articles</h4>
                <div className="space-y-2">
                  <a href="/dashboard/knowledge-base/1" className="block p-2 rounded-md text-sm hover:bg-muted">
                    Troubleshooting account access issues
                  </a>
                  <a href="/dashboard/knowledge-base/2" className="block p-2 rounded-md text-sm hover:bg-muted">
                    Password reset procedure
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Quick actions for agents */}
          {canManageTicket && (
            <Card>
              <CardContent className="pt-6 space-y-4">
                <h4 className="text-sm font-medium">Quick Actions</h4>
                <div className="space-y-2">
                  {ticket.status !== 'resolved' && (
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => handleUpdateStatus('resolved')}
                    >
                      <CheckCircle size={16} className="mr-2" />
                      Mark as Resolved
                    </Button>
                  )}
                  
                  {ticket.status !== 'closed' && (
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => handleUpdateStatus('closed')}
                    >
                      <XCircle size={16} className="mr-2" />
                      Close Ticket
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
