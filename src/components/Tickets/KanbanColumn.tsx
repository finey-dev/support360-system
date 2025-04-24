
import { ReactNode } from "react";
import { useDroppable } from "@dnd-kit/core";

interface KanbanColumnProps {
  title: string;
  count: number;
  color: "yellow" | "blue" | "green" | "gray";
  children: ReactNode;
  id: string;
}

export const KanbanColumn = ({ title, count, color, children, id }: KanbanColumnProps) => {
  const { setNodeRef } = useDroppable({
    id: id,
  });
  
  const colorStyles = {
    yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
    blue: "bg-blue-100 text-blue-800 border-blue-200",
    green: "bg-green-100 text-green-800 border-green-200",
    gray: "bg-gray-100 text-gray-800 border-gray-200",
  };
  
  return (
    <div className="flex flex-col h-[calc(100vh-280px)] min-h-[400px] max-w-full">
      <div className={`p-3 rounded-t-lg ${colorStyles[color]} font-medium flex justify-between items-center sticky top-0 z-10`}>
        <span>{title}</span>
        <span className="text-xs py-0.5 px-2 rounded-full bg-white">{count}</span>
      </div>
      <div 
        ref={setNodeRef}
        className="flex-1 bg-muted/30 p-2 rounded-b-lg overflow-y-auto"
      >
        <div className="space-y-2">
          {children}
        </div>
      </div>
    </div>
  );
};
