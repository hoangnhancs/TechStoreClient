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
} from "@mui/icons-material";
import { useState } from "react";
import { Link } from "react-router";
import CollectionsIcon from '@mui/icons-material/Collections';
import Inventory2Icon from '@mui/icons-material/Inventory2';


export default function Sidebar() {
    const [openProduct, setOpenProduct] = useState(true);
    const [openWidget, setOpenWidget] = useState(false);
    const toggleProduct = () => setOpenProduct(!openProduct);
    const toggleWidget = () => setOpenWidget(!openWidget);

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
                    <ListItemButton component={Link} to="/dashboard/analytics">
                        <ListItemIcon><Dashboard /></ListItemIcon>
                        <ListItemText primary="Analytics" />
                    </ListItemButton>

                    {/*Banner section*/}
                    <ListItemButton component={Link} to="/dashboard/banners">
                        <ListItemIcon><CollectionsIcon /></ListItemIcon>
                        <ListItemText primary="Banners" />
                    </ListItemButton>

                    {/* Product Section */}
                    <ListItemButton onClick={toggleProduct}>
                        <ListItemIcon><Category /></ListItemIcon>
                        <ListItemText primary="Product" />
                        {openProduct ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={openProduct} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                        <ListItemButton sx={{ pl: 4 }} component={Link} to="/dashboard/orders">
                            <ListItemIcon><History /></ListItemIcon>
                            <ListItemText primary="Order History" />
                        </ListItemButton>
                        <ListItemButton sx={{ pl: 4 }} component={Link} to="/dashboard/products">
                            <ListItemIcon><ShoppingCart /></ListItemIcon>
                            <ListItemText primary="Quản lý sản phẩm" />
                        </ListItemButton>
                        <ListItemButton sx={{ pl: 4 }} component={Link} to="/dashboard/inventory">
                            <ListItemIcon><Inventory2Icon /></ListItemIcon>
                            <ListItemText primary="Nhập kho" />
                        </ListItemButton>
                        <ListItemButton sx={{ pl: 4 }} component={Link} to="/dashboard/notifications">
                            <ListItemText primary="Thông báo" />
                        </ListItemButton>
                        <ListItemButton sx={{ pl: 4 }} component={Link} to="/dashboard/flash-sales">
                            <ListItemIcon><People /></ListItemIcon>
                            <ListItemText primary="Flash Sales" />
                        </ListItemButton>
                        <ListItemButton sx={{ pl: 4 }}>
                            <ListItemIcon><AddBox /></ListItemIcon>
                            <ListItemText primary="Add Product" />
                        </ListItemButton>
                        <ListItemButton sx={{ pl: 4 }}>
                            <ListItemIcon><Reviews /></ListItemIcon>
                            <ListItemText primary="Reviews" />
                        </ListItemButton>
                        </List>
                    </Collapse>
                    <ListItemButton onClick={toggleWidget}>
                        <ListItemIcon><Widgets /></ListItemIcon>
                        <ListItemText primary="Widgets" />
                        {openWidget ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={openWidget} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItemButton sx={{ pl: 4 }}>
                                <ListItemText primary="Widget 1" />
                            </ListItemButton>
                        </List>
                    </Collapse>
                </List>
            </Box>
        </Drawer>
    );
}
