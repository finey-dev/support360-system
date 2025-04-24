
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";

interface CustomerSatisfactionChartProps {
  tickets: any[];
}

export const CustomerSatisfactionChart = ({ tickets }: CustomerSatisfactionChartProps) => {
  // Calculate satisfaction rates from ticket data
  // For this prototype, we'll generate satisfaction data
  const totalResolved = tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length;
  
  // Calculate ratings distribution (mocked for prototype)
  const data = [
    { name: "Very Satisfied", value: Math.floor(totalResolved * 0.45), fill: "#10B981" },
    { name: "Satisfied", value: Math.floor(totalResolved * 0.30), fill: "#3B82F6" },
    { name: "Neutral", value: Math.floor(totalResolved * 0.15), fill: "#6B7280" },
    { name: "Unsatisfied", value: Math.floor(totalResolved * 0.10), fill: "#F59E0B" }
  ];
  
  // If no data, show placeholder
  if (totalResolved === 0) {
    return (
      <div className="h-[250px] flex items-center justify-center border rounded-lg">
        <p className="text-muted-foreground">No satisfaction data available</p>
      </div>
    );
  }
  
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
    "Very Satisfied": { color: "#10B981" },
    "Satisfied": { color: "#3B82F6" },
    "Neutral": { color: "#6B7280" },
    "Unsatisfied": { color: "#F59E0B" },
  };

  return (
    <ChartContainer config={config} className="aspect-[4/3]">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltipContent />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
