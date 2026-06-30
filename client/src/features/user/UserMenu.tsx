import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import { Avatar, Box, Divider, ListItemIcon, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';
import { Add, Logout, Password, Person, Receipt } from '@mui/icons-material';
import { useLogoutMutation } from './userApi';
import { useDispatch } from 'react-redux';
import { BasicUser } from '../../lib/types';
import { clearCurrentUser } from './userSlice';
import LoadingComponent from '../../components/LoadingComponent';
import DashboardIcon from '@mui/icons-material/Dashboard';

type Props = {
    currentUser: BasicUser
}

export default function UserMenu({currentUser}: Props) {
    const dispatch = useDispatch();
    // const {data: currentUser} = useGetCurrentUserQuery()
    const [logoutUser, {isLoading}] = useLogoutMutation()
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logoutUser()
        dispatch(clearCurrentUser())       
    }

    if (isLoading) {
        return (
            <LoadingComponent />
        )
    }

    return (
        <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Button
                onClick={handleClick}
                color='inherit'
                size='large'
                sx={{fontSize: '1.1rem'}}
            >
                <Box display='flex' alignItems='center' gap={2} minWidth={0}>
                    <Avatar 
                        alt={currentUser?.displayName + ' image'}
                        src={currentUser?.imageUrl} 
                    />
                    <Box
                        sx={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            fontSize: '1.1rem',
                            fontWeight: 500,
                            maxWidth: 120, // hoặc giá trị phù hợp với layout của bạn
                        }}
                    >
                        {currentUser?.displayName}
                    </Box>
                </Box>
            </Button>
            <Menu
                keepMounted        
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                slotProps={{
                    list: {
                        'aria-labelledby': 'basic-button',
                    },
                }}
            >
                {(currentUser?.roles.includes('Admin')) && 
                    [
                        <MenuItem key={'add-new-product'} component={Link} to='/add-new-product' onClick={handleClose}>
                            <ListItemIcon>
                                <Add />
                            </ListItemIcon>
                            <ListItemText>Thêm sản phẩm</ListItemText>
                        </MenuItem>,
                        <MenuItem key={'dashboard'} component={Link} to='/dashboard' onClick={handleClose}>
                            <ListItemIcon>
                                <DashboardIcon />
                            </ListItemIcon>
                            <ListItemText>Dashboard</ListItemText>
                        </MenuItem>
                    ]
                }
                
                <MenuItem component={Link} to={'/profile'} onClick={handleClose}>
                    <ListItemIcon>
                        <Person />
                    </ListItemIcon>
                    <ListItemText>Thông tin cá nhân</ListItemText>
                </MenuItem>
                <MenuItem component={Link} to={'/notifications'} onClick={handleClose}>
                    <ListItemIcon>
                        <Person />
                    </ListItemIcon>
                    <ListItemText>Thông báo</ListItemText>
                </MenuItem>
                <MenuItem component={Link} to={`/my-orders`} onClick={handleClose}>
                    <ListItemIcon>
                        <Receipt />
                    </ListItemIcon>
                    <ListItemText>Đơn hàng của tôi</ListItemText>
                </MenuItem>
                <MenuItem component={Link} to={`/change-password`} onClick={handleClose}>
                    <ListItemIcon>
                        <Password />
                    </ListItemIcon>
                    <ListItemText>Đổi mật khẩu</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => {
                    handleLogout();
                    handleClose();     
                }}>
                    <ListItemIcon>
                        <Logout />
                    </ListItemIcon>
                    <ListItemText>Đăng xuất</ListItemText>
                </MenuItem>
            </Menu>
        </Box>
    );
}
