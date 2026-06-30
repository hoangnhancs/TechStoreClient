import { Box } from "@mui/material";
import { useState } from "react";
import Sidebar from "./SideBar";
import { Outlet } from "react-router";


export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  
  // const [prevCustommers, setPrevCustommers] = useState<User[]>([]); // Placeholder for previous customers data
  // const [prevTotalSold , setPrevTotalSold] = useState<{ totalQuantity: number, totalRevenue: number }>({ totalQuantity: 0, totalRevenue: 0 }); // Placeholder for previous orders data
  // const [prevSalesCount, setPrevSalesCount] = useState(0); // Placeholder for previous sales count


  
  return (
    <Box display="flex" sx={{ width: '100%', minHeight: "calc(100vh - 80px)" }}>
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <Box 
        flex={1} 
        sx={{ 
          mt: 1, 
          p: 2, 
          width: '100%',
          overflowX: 'auto',
        }} 
        flexDirection={"column"} 
        display="flex"
      >
        <Outlet />
      </Box>
  </Box>
  )
}
