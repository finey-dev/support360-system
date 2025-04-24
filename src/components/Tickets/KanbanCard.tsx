
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { getInitials } from "@/lib/utils";

interface KanbanCardProps {
  ticket: any;
  containerId: string;
}

export const KanbanCard = ({ ticket, containerId }: KanbanCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: ticket.id,
    data: {
      ticket,
      containerId,
    },
  });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  const priorityColors: Record<string, string> = {
    low: "bg-blue-50 text-blue-600",
    medium: "bg-yellow-50 text-yellow-600",
    high: "bg-orange-50 text-orange-600",
    urgent: "bg-red-50 text-red-600",
  };

  return (
    <Link to={`/dashboard/tickets/${ticket.id}`}>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="bg-background p-3 rounded-md border shadow-sm hover:border-primary transition-colors cursor-grab active:cursor-grabbing"
      >
        <div className="flex flex-col space-y-3">
          <div>
            <div className="text-xs text-muted-foreground mb-1">
              #{ticket.id.toString().padStart(4, '0')}
            </div>
            <h3 className="font-medium text-sm">{ticket.subject}</h3>
          </div>
          
          <div className="flex justify-between items-center">
            <Badge variant="outline" className={priorityColors[ticket.priority]}>
              {ticket.priority}
            </Badge>
            
            <div className="flex items-center space-x-1">
              <Avatar className="h-6 w-6">
                <AvatarImage src={ticket.user?.avatarUrl} alt={ticket.user?.name} />
                <AvatarFallback>{getInitials(ticket.user?.name || '')}</AvatarFallback>
              </Avatar>
              
              {ticket.assignedToUser && (
                <Avatar className="h-6 w-6 border-2 border-background -ml-3">
                  <AvatarImage src={ticket.assignedToUser?.avatarUrl} alt={ticket.assignedToUser?.name} />
                  <AvatarFallback>{getInitials(ticket.assignedToUser?.name || '')}</AvatarFallback>
                </Avatar>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
