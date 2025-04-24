
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";

interface TicketStatusChartProps {
  tickets: any[];
}

export const TicketStatusChart = ({ tickets }: TicketStatusChartProps) => {
  // Count tickets by status
  const statusCounts = tickets.reduce((acc: Record<string, number>, ticket) => {
    acc[ticket.status] = (acc[ticket.status] || 0) + 1;
    return acc;
  }, {});
  
  const data = [
    { name: "Open", value: statusCounts.open || 0 },
    { name: "In Progress", value: statusCounts.in_progress || 0 },
    { name: "Resolved", value: statusCounts.resolved || 0 },
    { name: "Closed", value: statusCounts.closed || 0 },
  ];
  
  const COLORS = ['#ECC94B', '#4299E1', '#48BB78', '#A0AEC0'];
  
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
    Open: { color: COLORS[0] },
    "In Progress": { color: COLORS[1] },
    Resolved: { color: COLORS[2] },
    Closed: { color: COLORS[3] },
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
