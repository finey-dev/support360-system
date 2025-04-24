
import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { format, subDays, subWeeks, subMonths, startOfDay, endOfDay, differenceInDays } from "date-fns";

interface ResponseTimeChartProps {
  tickets: any[];
  timeframe: 'daily' | 'weekly' | 'monthly';
}

export const ResponseTimeChart = ({ tickets, timeframe }: ResponseTimeChartProps) => {
  // Calculate date range
  const getDateRange = () => {
    const today = new Date();
    if (timeframe === 'daily') {
      return { start: subDays(today, 14), end: today };
    } else if (timeframe === 'weekly') {
      return { start: subWeeks(today, 12), end: today };
    } else {
      return { start: subMonths(today, 12), end: today };
    }
  };
  
  const { start, end } = getDateRange();
  
  const generateTimeSeriesData = () => {
    const dateRange = { start, end };
    const days = differenceInDays(dateRange.end, dateRange.start);
    
    // Filter tickets to the time range
    const filteredTickets = tickets.filter(ticket => {
      const createdAt = new Date(ticket.createdAt);
      return createdAt >= dateRange.start && createdAt <= dateRange.end;
    });
    
    // Create date buckets
    const buckets = [];
    
    if (timeframe === 'daily') {
      // Daily data points
      for (let i = 0; i <= days; i++) {
        const date = subDays(dateRange.end, days - i);
        const startOfDate = startOfDay(date);
        const endOfDate = endOfDay(date);
        
        // Get tickets created on this day
        const dayTickets = filteredTickets.filter(ticket => {
          const createdAt = new Date(ticket.createdAt);
          return createdAt >= startOfDate && createdAt <= endOfDate;
        });
        
        // Calculate average response time (in hours)
        let avgResponseTime = 0;
        if (dayTickets.length > 0) {
          // This is synthetic data for the prototype
          // In a real app, this would be calculated from the time between ticket creation and first response
          const baseTime = 1.5; // Base response time in hours
          const randomFactor = Math.random() * 2 - 1; // Random factor between -1 and 1
          avgResponseTime = Math.max(0.5, baseTime + randomFactor);
        }
        
        buckets.push({
          date: format(date, 'MMM dd'),
          value: avgResponseTime.toFixed(1)
        });
      }
    } else if (timeframe === 'weekly') {
      // Weekly data points
      for (let i = 0; i < 12; i++) {
        const weekEnd = subWeeks(dateRange.end, i);
        const weekStart = subDays(weekEnd, 6);
        
        // Get tickets created this week
        const weekTickets = filteredTickets.filter(ticket => {
          const createdAt = new Date(ticket.createdAt);
          return createdAt >= weekStart && createdAt <= weekEnd;
        });
        
        // Calculate average response time (in hours)
        let avgResponseTime = 0;
        if (weekTickets.length > 0) {
          // Synthetic data for the prototype
          const baseTime = 1.8;
          const randomFactor = Math.random() * 1 - 0.5; // Random factor between -0.5 and 0.5
          avgResponseTime = Math.max(0.5, baseTime + randomFactor);
        }
        
        buckets.push({
          date: `${format(weekStart, 'MMM dd')} - ${format(weekEnd, 'MMM dd')}`,
          value: avgResponseTime.toFixed(1)
        });
      }
      
      // Reverse to get chronological order
      buckets.reverse();
    } else {
      // Monthly data points
      for (let i = 0; i < 12; i++) {
        const monthEnd = subMonths(dateRange.end, i);
        const monthStart = subMonths(monthEnd, 1);
        
        // Get tickets created this month
        const monthTickets = filteredTickets.filter(ticket => {
          const createdAt = new Date(ticket.createdAt);
          return createdAt > monthStart && createdAt <= monthEnd;
        });
        
        // Calculate average response time (in hours)
        let avgResponseTime = 0;
        if (monthTickets.length > 0) {
          // Synthetic data for the prototype
          const baseTime = 2.0;
          const randomFactor = Math.random() * 1 - 0.5; // Random factor between -0.5 and 0.5
          avgResponseTime = Math.max(0.5, baseTime + randomFactor);
        }
        
        buckets.push({
          date: format(monthEnd, 'MMM yyyy'),
          value: avgResponseTime.toFixed(1)
        });
      }
      
      // Reverse to get chronological order
      buckets.reverse();
    }
    
    return buckets;
  };
  
  const data = useMemo(() => generateTimeSeriesData(), [tickets, timeframe, start, end]);
  
  const config = {
    'Response Time': { color: '#E53E3E' },
  };

  return (
    <ChartContainer config={config} className="aspect-[4/3]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
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
            dataKey="date" 
            tick={{ fontSize: 12 }} 
            angle={-45}
            textAnchor="end"
            height={70}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            label={{ value: 'Hours', angle: -90, position: 'insideLeft', fontSize: 12, offset: -5 }}
          />
          <Tooltip content={<ChartTooltipContent />} />
          <Line 
            type="monotone" 
            dataKey="value" 
            name="Response Time" 
            stroke="#E53E3E" 
            activeDot={{ r: 8 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
