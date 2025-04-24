
import { useMemo } from "react";
import { RadialBarChart, RadialBar, ResponsiveContainer, Legend } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";

interface CustomerSatisfactionChartProps {
  tickets: any[];
}

export const CustomerSatisfactionChart = ({ tickets }: CustomerSatisfactionChartProps) => {
  // In a real app, this would come from actual satisfaction surveys
  // For the prototype, generate synthetic data based on resolution time
  const getSatisfactionData = () => {
    // Generate synthetic satisfaction distribution
    // Higher satisfaction for quickly resolved tickets
    const resolvedTickets = tickets.filter(t => t.status === 'resolved' || t.status === 'closed');
    const totalResolved = resolvedTickets.length;
    
    if (totalResolved === 0) {
      return [
        { name: 'Very Satisfied', value: 0 },
        { name: 'Satisfied', value: 0 },
        { name: 'Neutral', value: 0 },
        { name: 'Unsatisfied', value: 0 },
        { name: 'Very Unsatisfied', value: 0 }
      ];
    }
    
    // Calculate the distribution based on synthetic satisfaction data
    // This simulates a customer satisfaction survey
    const veryUnsatisfied = Math.round(totalResolved * 0.05);
    const unsatisfied = Math.round(totalResolved * 0.10);
    const neutral = Math.round(totalResolved * 0.15);
    const satisfied = Math.round(totalResolved * 0.40);
    const verySatisfied = totalResolved - veryUnsatisfied - unsatisfied - neutral - satisfied;
    
    // Calculate percentages
    const total = totalResolved;
    const verySatisfiedPercent = ((verySatisfied / total) * 100).toFixed(1);
    const satisfiedPercent = ((satisfied / total) * 100).toFixed(1);
    const neutralPercent = ((neutral / total) * 100).toFixed(1);
    const unsatisfiedPercent = ((unsatisfied / total) * 100).toFixed(1);
    const veryUnsatisfiedPercent = ((veryUnsatisfied / total) * 100).toFixed(1);
    
    return [
      { name: 'Very Satisfied', value: parseFloat(verySatisfiedPercent), fill: '#48BB78' },
      { name: 'Satisfied', value: parseFloat(satisfiedPercent), fill: '#9AE6B4' },
      { name: 'Neutral', value: parseFloat(neutralPercent), fill: '#ECC94B' },
      { name: 'Unsatisfied', value: parseFloat(unsatisfiedPercent), fill: '#F6AD55' },
      { name: 'Very Unsatisfied', value: parseFloat(veryUnsatisfiedPercent), fill: '#F56565' }
    ];
  };
  
  const data = useMemo(() => getSatisfactionData(), [tickets]);
  
  // Calculate overall satisfaction score (weighted average)
  const satisfactionScore = useMemo(() => {
    const weights = {
      'Very Satisfied': 5,
      'Satisfied': 4,
      'Neutral': 3,
      'Unsatisfied': 2,
      'Very Unsatisfied': 1
    };
    
    const total = data.reduce((acc, item) => acc + item.value, 0);
    if (total === 0) return 0;
    
    const weightedSum = data.reduce((acc, item) => {
      return acc + (item.value * weights[item.name as keyof typeof weights]);
    }, 0);
    
    return (weightedSum / total).toFixed(1);
  }, [data]);
  
  const config = {
    'Very Satisfied': { color: '#48BB78' },
    'Satisfied': { color: '#9AE6B4' },
    'Neutral': { color: '#ECC94B' },
    'Unsatisfied': { color: '#F6AD55' },
    'Very Unsatisfied': { color: '#F56565' },
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="text-3xl font-bold">{satisfactionScore}/5</div>
        <div className="text-sm text-muted-foreground">Overall Satisfaction</div>
      </div>
      
      <ChartContainer config={config} className="aspect-[4/3]">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="20%"
            outerRadius="90%"
            barSize={15}
            data={data}
          >
            <RadialBar
              minAngle={15}
              label={{ position: 'insideEnd', fill: '#fff', fontWeight: 600, fontSize: 12 }}
              background
              dataKey="value"
            />
            <Legend
              iconSize={10}
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
            />
            <ChartTooltip content={<ChartTooltipContent />} />
          </RadialBarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};
