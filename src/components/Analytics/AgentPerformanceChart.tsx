
import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";

interface AgentPerformanceChartProps {
  tickets: any[];
  agents: any[];
}

export const AgentPerformanceChart = ({ tickets, agents }: AgentPerformanceChartProps) => {
  const data = useMemo(() => {
    const agentStats = agents.map(agent => {
      const agentTickets = tickets.filter(t => t.assignedToId === agent.id);
      const resolvedTickets = agentTickets.filter(t => t.status === 'resolved' || t.status === 'closed');
      
      // Calculate resolution time
      let avgResolutionTime = 0;
      if (resolvedTickets.length > 0) {
        const totalTime = resolvedTickets.reduce((acc, ticket) => {
          const createdDate = new Date(ticket.createdAt);
          const updatedDate = new Date(ticket.updatedAt);
          const diffTime = Math.abs(updatedDate.getTime() - createdDate.getTime());
          const diffDays = diffTime / (1000 * 60 * 60 * 24);
          return acc + diffDays;
        }, 0);
        
        avgResolutionTime = parseFloat((totalTime / resolvedTickets.length).toFixed(1));
      }
      
      // Calculate resolution rate
      const resolutionRate = agentTickets.length > 0
        ? parseFloat(((resolvedTickets.length / agentTickets.length) * 100).toFixed(0))
        : 0;
      
      return {
        name: agent.name.split(' ')[0], // Use first name for display
        tickets: agentTickets.length,
        resolved: resolvedTickets.length,
        resolutionTime: avgResolutionTime,
        resolutionRate
      };
    });
    
    // Sort by number of resolved tickets
    return agentStats
      .sort((a, b) => b.resolved - a.resolved)
      .slice(0, 10); // Limit to top 10 agents
  }, [tickets, agents]);
  
  const config = {
    tickets: { color: '#4299E1' },
    resolved: { color: '#48BB78' },
  };

  return (
    <ChartContainer config={config} className="aspect-[4/3]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 30,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={70}
          />
          <YAxis 
            allowDecimals={false}
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<ChartTooltipContent />} />
          <Bar dataKey="tickets" name="Total Tickets" fill="#4299E1" radius={[4, 4, 0, 0]} />
          <Bar dataKey="resolved" name="Resolved Tickets" fill="#48BB78" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
