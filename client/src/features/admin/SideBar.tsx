// components/Sidebar.tsx
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,

} from "@mui/material";
import {
  Dashboard,
  ExpandLess,
  ExpandMore,
  ShoppingCart,
  People,
  AddBox,
  Reviews,
  Widgets,
  Category,
  History,
  AssignmentTurnedIn,
} from "@mui/icons-material";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import CollectionsIcon from '@mui/icons-material/Collections';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FlashOnIcon from '@mui/icons-material/FlashOn';


export default function Sidebar() {
    const [openProduct, setOpenProduct] = useState(true);
    const [openWidget, setOpenWidget] = useState(false);
    const toggleProduct = () => setOpenProduct(!openProduct);
    const toggleWidget = () => setOpenWidget(!openWidget);
    const location = useLocation();

    const isActive = (path: string) => {
        if (path === "/dashboard/analytics") {
            return location.pathname === path;
        }
        return location.pathname.startsWith(path);
    };

    const getButtonStyle = (path: string, pl?: number) => ({
        pl: pl ?? 2,
        borderRadius: "8px",
        mx: 1,
        mb: 0.5,
        width: "calc(100% - 16px)",
        "&.Mui-selected": {
            bgcolor: "primary.main",
            color: "primary.contrastText",
            "&:hover": {
                bgcolor: "primary.dark",
            },
            "& .MuiListItemIcon-root": {
                color: "primary.contrastText",
            },
        },
    });

    return (
        <Drawer
            variant="permanent" 
            anchor="left"
            sx={{
                width: 240,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                    width: 240,
                    boxSizing: 'border-box',
                    top: 80, // 👈 Thêm dòng này để sidebar không đè navbar
                },
            }}
        >
            <Box sx={{ width: "100%", bgcolor: "#e3f2fd", height: "100%" }}>
                <List component="nav">
                    {/* Dashboards */}
                    <ListItemButton 
                        component={Link} 
                        to="/dashboard/analytics" 
                        selected={isActive("/dashboard/analytics")}
                        sx={getButtonStyle("/dashboard/analytics")}
                    >
                        <ListItemIcon><Dashboard /></ListItemIcon>
                        <ListItemText primary="Thống kê" />
                    </ListItemButton>

                    {/*Banner section*/}
                    <ListItemButton 
                        component={Link} 
                        to="/dashboard/banners" 
                        selected={isActive("/dashboard/banners")}
                        sx={getButtonStyle("/dashboard/banners")}
                    >
                        <ListItemIcon><CollectionsIcon /></ListItemIcon>
                        <ListItemText primary="Quản lý Banner" />
                    </ListItemButton>

                    {/* Product Section */}
                    <ListItemButton onClick={toggleProduct} sx={getButtonStyle("/dashboard/products-parent")}>
                        <ListItemIcon><Category /></ListItemIcon>
                        <ListItemText primary="Sản phẩm" />
                        {openProduct ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={openProduct} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItemButton 
                                component={Link} 
                                to="/dashboard/orders" 
                                selected={isActive("/dashboard/orders")}
                                sx={getButtonStyle("/dashboard/orders", 4)}
                            >
                                <ListItemIcon><History /></ListItemIcon>
                                <ListItemText primary="Lịch sử đơn hàng" />
                            </ListItemButton>
                            <ListItemButton 
                                component={Link} 
                                to="/dashboard/confirm-orders" 
                                selected={isActive("/dashboard/confirm-orders")}
                                sx={getButtonStyle("/dashboard/confirm-orders", 4)}
                            >
                                <ListItemIcon><AssignmentTurnedIn /></ListItemIcon>
                                <ListItemText primary="Xác nhận đơn hàng" />
                            </ListItemButton>
                            <ListItemButton 
                                component={Link} 
                                to="/dashboard/products" 
                                selected={isActive("/dashboard/products")}
                                sx={getButtonStyle("/dashboard/products", 4)}
                            >
                                <ListItemIcon><ShoppingCart /></ListItemIcon>
                                <ListItemText primary="Quản lý sản phẩm" />
                            </ListItemButton>
                            <ListItemButton 
                                component={Link} 
                                to="/dashboard/inventory" 
                                selected={isActive("/dashboard/inventory")}
                                sx={getButtonStyle("/dashboard/inventory", 4)}
                            >
                                <ListItemIcon><Inventory2Icon /></ListItemIcon>
                                <ListItemText primary="Nhập kho" />
                            </ListItemButton>
                            <ListItemButton sx={getButtonStyle("/dashboard/add-product", 4)}>
                                <ListItemIcon><AddBox /></ListItemIcon>
                                <ListItemText primary="Thêm sản phẩm" />
                            </ListItemButton>
                            <ListItemButton sx={getButtonStyle("/dashboard/reviews", 4)}>
                                <ListItemIcon><Reviews /></ListItemIcon>
                                <ListItemText primary="Đánh giá sản phẩm" />
                            </ListItemButton>
                        </List>
                    </Collapse>

                    {/* Thông báo (Tách ra ngoài) */}
                    <ListItemButton 
                        component={Link} 
                        to="/dashboard/notifications" 
                        selected={isActive("/dashboard/notifications")}
                        sx={getButtonStyle("/dashboard/notifications")}
                    >
                        <ListItemIcon><NotificationsIcon /></ListItemIcon>
                        <ListItemText primary="Thông báo" />
                    </ListItemButton>

                    {/* Flash Sales (Tách ra ngoài) */}
                    <ListItemButton 
                        component={Link} 
                        to="/dashboard/flash-sales" 
                        selected={isActive("/dashboard/flash-sales")}
                        sx={getButtonStyle("/dashboard/flash-sales")}
                    >
                        <ListItemIcon><FlashOnIcon /></ListItemIcon>
                        <ListItemText primary="Flash Sale" />
                    </ListItemButton>

                    <ListItemButton onClick={toggleWidget} sx={getButtonStyle("/dashboard/widgets-parent")}>
                        <ListItemIcon><Widgets /></ListItemIcon>
                        <ListItemText primary="Tiện ích" />
                        {openWidget ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={openWidget} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItemButton sx={getButtonStyle("/dashboard/widget-1", 4)}>
                                <ListItemText primary="Tiện ích 1" />
                            </ListItemButton>
                        </List>
                    </Collapse>
                </List>
            </Box>
        </Drawer>
    );
}
