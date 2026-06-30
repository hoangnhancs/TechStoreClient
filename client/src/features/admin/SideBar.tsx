import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
} from "@mui/material";
import {
  Dashboard,
  ExpandLess,
  ExpandMore,
  ShoppingCart,
  AddBox,
  Reviews,
  Widgets,
  Category,
  History,
  AssignmentTurnedIn,
  ChevronLeft,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import CollectionsIcon from '@mui/icons-material/Collections';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import { useTheme } from "@mui/material/styles";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function Sidebar({ open, setOpen }: Props) {
    const theme = useTheme();
    const [openProduct, setOpenProduct] = useState(true);
    const [openWidget, setOpenWidget] = useState(false);
    const toggleProduct = () => setOpenProduct(!openProduct);
    const toggleWidget = () => setOpenWidget(!openWidget);
    const location = useLocation();

    const handleProductClick = () => {
        if (!open) {
            setOpen(true);
            setOpenProduct(true);
        } else {
            toggleProduct();
        }
    };

    const handleWidgetClick = () => {
        if (!open) {
            setOpen(true);
            setOpenWidget(true);
        } else {
            toggleWidget();
        }
    };

    const isActive = (path: string) => {
        if (path === "/dashboard/analytics") {
            return location.pathname === path;
        }
        return location.pathname.startsWith(path);
    };

    const getButtonStyle = (_path?: string, pl?: number) => ({
        justifyContent: open ? 'initial' : 'center',
        px: open ? 2 : 0,
        pl: open && pl ? pl : undefined,
        // borderRadius: "8px",
        mx: open ? 1 : 0.5,
        mb: 0.5,
        width: open ? "calc(100% - 16px)" : "calc(100% - 8px)",
        minHeight: 48,
        transition: 'all 0.2s ease',
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

    const getIconStyle = () => ({
        minWidth: 0,
        mr: open ? 2 : 0,
        justifyContent: 'center',
    });

    const drawerWidth = open ? 240 : 64;
    const sidebarBg = theme.palette.mode === 'dark' ? 'background.paper' : '#e3f2fd';

    return (
        <Drawer
            variant="permanent" 
            anchor="left"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                borderRight: 'none',
                [`& .MuiDrawer-paper`]: {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    top: 80, 
                    height: 'calc(100vh - 80px)',
                    transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    overflowX: 'hidden',
                    borderRight: 'none',
                    backgroundColor: sidebarBg,
                    borderRadius: 0,
                },
            }}
        >
            <Box sx={{ width: "100%", bgcolor: 'transparent', minHeight: "100%", transition: 'background-color 0.3s' }}>
                <List component="nav" sx={{ pt: 1 }}>
                    {/* Toggle Button */}
                    <ListItemButton 
                        onClick={() => setOpen(!open)} 
                        sx={{ 
                            justifyContent: open ? 'flex-end' : 'center', 
                            py: 1, 
                            px: open ? 2 : 0, 
                            mb: 1,
                            borderRadius: '8px',
                            mx: open ? 1 : 0.5,
                            width: open ? "calc(100% - 16px)" : "calc(100% - 8px)",
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 0, mr: open ? 1.5 : 0, justifyContent: 'center' }}>
                            {open ? <ChevronLeft /> : <MenuIcon />}
                        </ListItemIcon>
                        {open && <ListItemText primary="Thu gọn" sx={{ color: 'text.secondary', fontSize: '14px' }} />}
                    </ListItemButton>
                    <Divider sx={{ mb: 1.5, mx: 1 }} />

                    {/* Thống kê */}
                    <ListItemButton 
                        component={Link} 
                        to="/dashboard/analytics" 
                        selected={isActive("/dashboard/analytics")}
                        sx={getButtonStyle("/dashboard/analytics")}
                    >
                        <ListItemIcon sx={getIconStyle()}><Dashboard /></ListItemIcon>
                        {open && <ListItemText primary="Thống kê" />}
                    </ListItemButton>

                    {/* Quản lý Banner */}
                    <ListItemButton 
                        component={Link} 
                        to="/dashboard/banners" 
                        selected={isActive("/dashboard/banners")}
                        sx={getButtonStyle("/dashboard/banners")}
                    >
                        <ListItemIcon sx={getIconStyle()}><CollectionsIcon /></ListItemIcon>
                        {open && <ListItemText primary="Quản lý Banner" />}
                    </ListItemButton>

                    {/* Sản phẩm */}
                    <ListItemButton onClick={handleProductClick} sx={getButtonStyle("/dashboard/products-parent")}>
                        <ListItemIcon sx={getIconStyle()}><Category /></ListItemIcon>
                        {open && <ListItemText primary="Sản phẩm" />}
                        {open && (openProduct ? <ExpandLess /> : <ExpandMore />)}
                    </ListItemButton>
                    <Collapse in={open && openProduct} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItemButton 
                                component={Link} 
                                to="/dashboard/orders" 
                                selected={isActive("/dashboard/orders")}
                                sx={getButtonStyle("/dashboard/orders", 4)}
                            >
                                <ListItemIcon sx={getIconStyle()}><History /></ListItemIcon>
                                {open && <ListItemText primary="Lịch sử đơn hàng" />}
                            </ListItemButton>
                            <ListItemButton 
                                component={Link} 
                                to="/dashboard/confirm-orders" 
                                selected={isActive("/dashboard/confirm-orders")}
                                sx={getButtonStyle("/dashboard/confirm-orders", 4)}
                            >
                                <ListItemIcon sx={getIconStyle()}><AssignmentTurnedIn /></ListItemIcon>
                                {open && <ListItemText primary="Xác nhận đơn hàng" />}
                            </ListItemButton>
                            <ListItemButton 
                                component={Link} 
                                to="/dashboard/products" 
                                selected={isActive("/dashboard/products")}
                                sx={getButtonStyle("/dashboard/products", 4)}
                            >
                                <ListItemIcon sx={getIconStyle()}><ShoppingCart /></ListItemIcon>
                                {open && <ListItemText primary="Quản lý sản phẩm" />}
                            </ListItemButton>
                            <ListItemButton 
                                component={Link} 
                                to="/dashboard/inventory" 
                                selected={isActive("/dashboard/inventory")}
                                sx={getButtonStyle("/dashboard/inventory", 4)}
                            >
                                <ListItemIcon sx={getIconStyle()}><Inventory2Icon /></ListItemIcon>
                                {open && <ListItemText primary="Nhập kho" />}
                            </ListItemButton>
                            <ListItemButton sx={getButtonStyle("/dashboard/add-product", 4)}>
                                <ListItemIcon sx={getIconStyle()}><AddBox /></ListItemIcon>
                                {open && <ListItemText primary="Thêm sản phẩm" />}
                            </ListItemButton>
                            <ListItemButton sx={getButtonStyle("/dashboard/reviews", 4)}>
                                <ListItemIcon sx={getIconStyle()}><Reviews /></ListItemIcon>
                                {open && <ListItemText primary="Đánh giá sản phẩm" />}
                            </ListItemButton>
                        </List>
                    </Collapse>

                    {/* Thông báo */}
                    <ListItemButton 
                        component={Link} 
                        to="/dashboard/notifications" 
                        selected={isActive("/dashboard/notifications")}
                        sx={getButtonStyle("/dashboard/notifications")}
                    >
                        <ListItemIcon sx={getIconStyle()}><NotificationsIcon /></ListItemIcon>
                        {open && <ListItemText primary="Thông báo" />}
                    </ListItemButton>

                    {/* Flash Sale */}
                    <ListItemButton 
                        component={Link} 
                        to="/dashboard/flash-sales" 
                        selected={isActive("/dashboard/flash-sales")}
                        sx={getButtonStyle("/dashboard/flash-sales")}
                    >
                        <ListItemIcon sx={getIconStyle()}><FlashOnIcon /></ListItemIcon>
                        {open && <ListItemText primary="Flash Sale" />}
                    </ListItemButton>

                    {/* Tiện ích */}
                    <ListItemButton onClick={handleWidgetClick} sx={getButtonStyle("/dashboard/widgets-parent")}>
                        <ListItemIcon sx={getIconStyle()}><Widgets /></ListItemIcon>
                        {open && <ListItemText primary="Tiện ích" />}
                        {open && (openWidget ? <ExpandLess /> : <ExpandMore />)}
                    </ListItemButton>
                    <Collapse in={open && openWidget} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItemButton sx={getButtonStyle("/dashboard/widget-1", 4)}>
                                {open && <ListItemText primary="Tiện ích 1" />}
                            </ListItemButton>
                        </List>
                    </Collapse>
                </List>
            </Box>
        </Drawer>
    );
}
