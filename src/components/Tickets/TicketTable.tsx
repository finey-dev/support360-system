
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getKbArticles, getTickets, getUser } from "@/lib/db";
import { useAuth } from "@/components/Auth/AuthContext";
import { getInitials, getRelativeTime } from "@/lib/utils";

interface TicketTableProps {
  limit?: number;
}

export const TicketTable = ({ limit }: TicketTableProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tickets, setTickets] = useState<any[]>([]);
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
    
    // Sort by updated date descending
    filteredTickets.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
    
    // Apply limit if needed
    if (limit && limit > 0) {
      filteredTickets = filteredTickets.slice(0, limit);
    }
    
    // Enhance tickets with user data
    const enhancedTickets = filteredTickets.map(ticket => {
      const ticketUser = getUser(ticket.userId);
      const assignedTo = ticket.assignedToId ? getUser(ticket.assignedToId) : null;
      
      return {
        ...ticket,
        user: ticketUser,
        assignedToUser: assignedTo
      };
    });
    
    setTickets(enhancedTickets);
    setLoading(false);
  }, [user, limit]);

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

  const handleRowClick = (ticketId: number) => {
    navigate(`/dashboard/tickets/${ticketId}`);
  };

  if (loading) {
    return (
      <Card className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left text-muted-foreground bg-muted">
              <th className="px-6 py-3 text-xs font-medium">ID</th>
              <th className="px-6 py-3 text-xs font-medium">Subject</th>
              <th className="px-6 py-3 text-xs font-medium">Status</th>
              <th className="px-6 py-3 text-xs font-medium">Priority</th>
              <th className="px-6 py-3 text-xs font-medium">Submitted by</th>
              <th className="px-6 py-3 text-xs font-medium">Assigned to</th>
              <th className="px-6 py-3 text-xs font-medium">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {tickets.length > 0 ? (
              tickets.map((ticket) => (
                <tr 
                  key={ticket.id} 
                  className="hover:bg-muted/50 cursor-pointer"
                  onClick={() => handleRowClick(ticket.id)}
                >
                  <td className="px-6 py-4 text-sm">#{ticket.id.toString().padStart(4, '0')}</td>
                  <td className="px-6 py-4">
                    <Link
                      to={`/dashboard/tickets/${ticket.id}`}
                      className="text-sm font-medium hover:underline"
                      onClick={(e) => e.stopPropagation()} // Prevent row click handler from firing
                    >
                      {ticket.subject}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className={statusColors[ticket.status]}>
                      {ticket.status.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className={priorityColors[ticket.priority]}>
                      {ticket.priority}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage src={ticket.user?.avatarUrl} alt={ticket.user?.name} />
                        <AvatarFallback>{getInitials(ticket.user?.name || '')}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{ticket.user?.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {ticket.assignedToUser ? (
                      <div className="flex items-center">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage src={ticket.assignedToUser?.avatarUrl} alt={ticket.assignedToUser?.name} />
                          <AvatarFallback>{getInitials(ticket.assignedToUser?.name || '')}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{ticket.assignedToUser?.name}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">Unassigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {getRelativeTime(ticket.updatedAt)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                  No tickets found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
