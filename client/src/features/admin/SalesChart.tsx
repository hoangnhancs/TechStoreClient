import { Box, Paper, Typography } from "@mui/material";
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Order } from "../../lib/types";
import React from "react";
import { formatCurrency } from "../../lib/util/util";

type SalesChartProps = {
  orders: Order[];
};

const SalesChart = React.memo(function SalesChart({ orders }: SalesChartProps) {
  const formatRevenue = (amount: number) => {
    if (amount >= 1_000_000_000) {
      return (amount / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
    }
    if (amount >= 1_000_000) {
      return (amount / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (amount >= 1_000) {
      return (amount / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return amount.toString();
  }
  const chartData = orders.reduce<Record<string, {revenue: number, quantity: number}>>((acc, order) => {
    const date = new Date(order.updatedAt).toLocaleDateString('vi-Vn');
    if (!acc[date]) {
      acc[date] = { revenue: 0, quantity: 0 };
    }
    order.items.forEach(item => {
      acc[date].revenue += item.unitPrice * item.quantity;
      acc[date].quantity += item.quantity;
    });
    return acc;
  }, {})
  const chartDataArray = Object.entries(chartData).map(([date, values]) => ({
    date,
    ...values
  })).sort((a, b) => {
      const [dayA, monthA, yearA] = a.date.split('/').map(Number);
      const [dayB, monthB, yearB] = b.date.split('/').map(Number);
      const dateA = new Date(yearA, monthA - 1, dayA);
      const dateB = new Date(yearB, monthB - 1, dayB);
      return dateA.getTime() - dateB.getTime();});
  console.log("Chart data:", chartDataArray);
  const overallRevenue = chartDataArray.reduce((acc, item) => acc + item.revenue, 0)/ chartDataArray.length || 0;
  const overallQuantity = (chartDataArray.reduce((acc, item) => acc + item.quantity, 0)/ chartDataArray.length).toFixed(0) || 0;
  return (
    <Paper sx={{ p: 2, display: "flex"}} >
      <Box display={"flex"} flexDirection={"column"} flex={1} sx={{mt: 2}} justifyContent={"center"} gap={2.5}>
        <Box display={"flex"} alignItems={"left"} flexDirection={"column"} gap={1} >
          <Box display={"flex"} gap={1} alignItems={"center"}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                bgcolor: '#FFAE1F',
              }}
            />
            <Typography>
              Số lượng trung bình:
            </Typography>
          </Box>
          <Typography sx={{ ml: 2}}>
            {overallQuantity}
          </Typography>
        </Box>
        <Box display={"flex"} alignItems={"left"} flexDirection={"column"} gap={1}>
          <Box display={"flex"} gap={1} alignItems={"center"}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                bgcolor: '#26BA4F', 
              }}
            />
            <Typography>
              Doanh thu trung bình:
            </Typography>
          </Box>
          
          <Typography sx={{ ml: 2}}>
            {formatCurrency(overallRevenue)}
          </Typography>
        </Box>
      </Box>
      <Box flex={6} display={"flex"} flexDirection={"row"} sx={{ width: "100%"}}>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={chartDataArray} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3f51b5" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#3f51b5" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="date" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="quantity"
              stroke="#3f51b5"
              fillOpacity={1}
              fill="url(#colorSales)"
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={chartDataArray} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3688fa" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#3688fa" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="date" />
            <YAxis tickFormatter={formatRevenue} />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip
              formatter={(value: number) => {
                return [formatRevenue(value), 'Revenue'];
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#3688fa"
              fillOpacity={1}
              fill="url(#colorRevenue)"
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
    
  );
})

export default SalesChart