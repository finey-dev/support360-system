import { useState, useEffect } from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { getTickets, updateTicket, getUser } from "@/lib/db";
import { KanbanColumn } from "./KanbanColumn";
import { KanbanCard } from "./KanbanCard";
import { useAuth } from "@/components/Auth/AuthContext";
import { useToast } from "@/components/ui/use-toast";

export const KanbanBoard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tickets, setTickets] = useState<Record<string, any[]>>({
    open: [],
    in_progress: [],
    resolved: [],
    closed: []
  });
  const [loading, setLoading] = useState(true);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );
  
  const fetchTickets = () => {
    if (!user) return;
    
    // Get tickets based on user role
    let filteredTickets;
    if (user.role === 'customer') {
      filteredTickets = getTickets({ userId: user.id });
    } else {
      // Agents and admins can see all tickets
      filteredTickets = getTickets();
    }
    
    // Enhanced tickets with user data
    const enhancedTickets = filteredTickets.map(ticket => {
      const ticketUser = getUser(ticket.userId);
      const assignedTo = ticket.assignedToId ? getUser(ticket.assignedToId) : null;
      
      return {
        ...ticket,
        user: ticketUser,
        assignedToUser: assignedTo
      };
    });
    
    // Group by status
    const groupedTickets = {
      open: enhancedTickets.filter(t => t.status === 'open'),
      in_progress: enhancedTickets.filter(t => t.status === 'in_progress'),
      resolved: enhancedTickets.filter(t => t.status === 'resolved'),
      closed: enhancedTickets.filter(t => t.status === 'closed')
    };
    
    setTickets(groupedTickets);
    setLoading(false);
  };
  
  useEffect(() => {
    fetchTickets();
  }, [user]);
  
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const activeId = active.id;
    const overId = over.id;
    
    // If the item is dropped in a different container
    if (active.data.current.sortable.containerId !== over.data.current?.sortable.containerId) {
      const activeContainer = active.data.current.sortable.containerId;
      const overContainer = over.data.current?.sortable.containerId;
      
      const activeIndex = tickets[activeContainer].findIndex(t => t.id === activeId);
      
      if (activeIndex !== -1) {
        // Create new ticket arrays
        const newTickets = { ...tickets };
        const ticketToMove = { ...newTickets[activeContainer][activeIndex] };
        
        // Remove from old container
        newTickets[activeContainer] = newTickets[activeContainer].filter(t => t.id !== activeId);
        
        // Update ticket status
        const newStatus = overContainer as 'open' | 'in_progress' | 'resolved' | 'closed';
        ticketToMove.status = newStatus;
        
        // Add to new container
        newTickets[overContainer] = [...newTickets[overContainer], ticketToMove];
        
        setTickets(newTickets);
        
        // Update in database
        try {
          updateTicket(activeId, { status: newStatus });
          toast({
            title: "Status updated",
            description: `Ticket status has been updated to ${newStatus.replace('_', ' ')}.`,
          });
          // Fetch latest tickets after successful update
          fetchTickets();
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to update ticket status.",
            variant: "destructive",
          });
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {['open', 'in_progress', 'resolved', 'closed'].map((status) => (
          <div key={status} className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 overflow-x-auto">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <KanbanColumn 
          title="Open" 
          count={tickets.open.length}
          color="yellow"
          id="open"
        >
          <SortableContext
            items={tickets.open.map(t => t.id)}
            strategy={verticalListSortingStrategy}
          >
            {tickets.open.map((ticket) => (
              <KanbanCard key={ticket.id} ticket={ticket} containerId="open" />
            ))}
          </SortableContext>
          
          {tickets.open.length === 0 && (
            <div className="p-4 text-center text-sm text-muted-foreground border border-dashed rounded-lg">
              No tickets
            </div>
          )}
        </KanbanColumn>
        
        <KanbanColumn 
          title="In Progress" 
          count={tickets.in_progress.length}
          color="blue"
          id="in_progress"
        >
          <SortableContext
            items={tickets.in_progress.map(t => t.id)}
            strategy={verticalListSortingStrategy}
          >
            {tickets.in_progress.map((ticket) => (
              <KanbanCard key={ticket.id} ticket={ticket} containerId="in_progress" />
            ))}
          </SortableContext>
          
          {tickets.in_progress.length === 0 && (
            <div className="p-4 text-center text-sm text-muted-foreground border border-dashed rounded-lg">
              No tickets
            </div>
          )}
        </KanbanColumn>
        
        <KanbanColumn 
          title="Resolved" 
          count={tickets.resolved.length}
          color="green"
          id="resolved"
        >
          <SortableContext
            items={tickets.resolved.map(t => t.id)}
            strategy={verticalListSortingStrategy}
          >
            {tickets.resolved.map((ticket) => (
              <KanbanCard key={ticket.id} ticket={ticket} containerId="resolved" />
            ))}
          </SortableContext>
          
          {tickets.resolved.length === 0 && (
            <div className="p-4 text-center text-sm text-muted-foreground border border-dashed rounded-lg">
              No tickets
            </div>
          )}
        </KanbanColumn>
        
        <KanbanColumn 
          title="Closed" 
          count={tickets.closed.length}
          color="gray"
          id="closed"
        >
          <SortableContext
            items={tickets.closed.map(t => t.id)}
            strategy={verticalListSortingStrategy}
          >
            {tickets.closed.map((ticket) => (
              <KanbanCard key={ticket.id} ticket={ticket} containerId="closed" />
            ))}
          </SortableContext>
          
          {tickets.closed.length === 0 && (
            <div className="p-4 text-center text-sm text-muted-foreground border border-dashed rounded-lg">
              No tickets
            </div>
          )}
        </KanbanColumn>
      </DndContext>
    </div>
  );
};
