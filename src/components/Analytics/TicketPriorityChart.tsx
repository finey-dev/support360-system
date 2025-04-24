
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";

interface TicketPriorityChartProps {
  tickets: any[];
}

export const TicketPriorityChart = ({ tickets }: TicketPriorityChartProps) => {
  // Count tickets by priority
  const priorityCounts = tickets.reduce((acc: Record<string, number>, ticket) => {
    acc[ticket.priority] = (acc[ticket.priority] || 0) + 1;
    return acc;
  }, {});
  
  const data = [
    { name: "Low", value: priorityCounts.low || 0 },
    { name: "Medium", value: priorityCounts.medium || 0 },
    { name: "High", value: priorityCounts.high || 0 },
    { name: "Urgent", value: priorityCounts.urgent || 0 },
  ];
  
  const COLORS = ['#3182CE', '#F6AD55', '#E53E3E', '#9F7AEA'];
  
  const renderCustomizedLabel = ({ 
    cx, 
    cy, 
    midAngle, 
    innerRadius, 
    outerRadius, 
    percent, 
    index 
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    if (percent < 0.05) return null;
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const config = {
    Low: { color: COLORS[0] },
    Medium: { color: COLORS[1] },
    High: { color: COLORS[2] },
    Urgent: { color: COLORS[3] },
  };

  return (
    <ChartContainer config={config} className="aspect-[4/3]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltipContent />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
