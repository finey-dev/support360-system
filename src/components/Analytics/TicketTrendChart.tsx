
import { useState, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { Card, CardContent } from "@/components/ui/card";
import { format, subDays, subWeeks, subMonths, startOfDay, endOfDay, differenceInDays } from "date-fns";

interface TicketTrendChartProps {
  tickets: any[];
  timeframe: 'daily' | 'weekly' | 'monthly';
}

export const TicketTrendChart = ({ tickets, timeframe }: TicketTrendChartProps) => {
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
        
        const newTickets = filteredTickets.filter(ticket => {
          const createdAt = new Date(ticket.createdAt);
          return createdAt >= startOfDate && createdAt <= endOfDate;
        }).length;
        
        buckets.push({
          date: format(date, 'MMM dd'),
          value: newTickets
        });
      }
    } else if (timeframe === 'weekly') {
      // Weekly data points
      for (let i = 0; i < 12; i++) {
        const weekEnd = subWeeks(dateRange.end, i);
        const weekStart = subDays(weekEnd, 6);
        
        const newTickets = filteredTickets.filter(ticket => {
          const createdAt = new Date(ticket.createdAt);
          return createdAt >= weekStart && createdAt <= weekEnd;
        }).length;
        
        buckets.push({
          date: `${format(weekStart, 'MMM dd')} - ${format(weekEnd, 'MMM dd')}`,
          value: newTickets
        });
      }
      
      // Reverse to get chronological order
      buckets.reverse();
    } else {
      // Monthly data points
      for (let i = 0; i < 12; i++) {
        const monthEnd = subMonths(dateRange.end, i);
        const monthStart = subMonths(monthEnd, 1);
        
        const newTickets = filteredTickets.filter(ticket => {
          const createdAt = new Date(ticket.createdAt);
          return createdAt > monthStart && createdAt <= monthEnd;
        }).length;
        
        buckets.push({
          date: format(monthEnd, 'MMM yyyy'),
          value: newTickets
        });
      }
      
      // Reverse to get chronological order
      buckets.reverse();
    }
    
    return buckets;
  };
  
  const data = useMemo(() => generateTimeSeriesData(), [tickets, timeframe, start, end]);
  
  const config = {
    Tickets: { color: '#9F7AEA' },
  };

  return (
    <ChartContainer config={config} className="aspect-[4/3]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
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
            allowDecimals={false}
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<ChartTooltipContent />} />
          <Area 
            type="monotone" 
            dataKey="value" 
            name="Tickets" 
            stroke="#9F7AEA" 
            fill="#9F7AEA" 
            fillOpacity={0.3} 
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
