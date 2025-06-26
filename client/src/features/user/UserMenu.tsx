import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import { Avatar, Box, Divider, ListItemIcon, ListItemText } from '@mui/material';

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Add, Logout, Password, Person, Receipt } from '@mui/icons-material';
import { useGetCurrentUserQuery, useLogoutMutation } from './userApi';
import { useDispatch } from 'react-redux';
import { basketApi } from '../../app/api/basketApi';

export default function UserMenu() {
    const dispatch = useDispatch();
    const {data: currentUser} = useGetCurrentUserQuery()
    const location = useLocation()
    const navigate = useNavigate()
    const [logoutUser, {isSuccess}] = useLogoutMutation()
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    React.useEffect(() => {
    if (isSuccess && location.pathname === '/basket') {
        navigate('/login');
    }
    }, [isSuccess, location.pathname, navigate]);

    const handleLogout = () => {
        logoutUser()
        dispatch(basketApi.util.resetApiState());        
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
                {(currentUser?.roles.includes('Admin')) && (
                    <MenuItem component={Link} to='/createActivity' onClick={handleClose}>
                    <ListItemIcon>
                        <Add />
                    </ListItemIcon>
                    <ListItemText>Add product</ListItemText>
                </MenuItem>
                )}
                
                <MenuItem component={Link} to={'/profile'} onClick={handleClose}>
                    <ListItemIcon>
                        <Person />
                    </ListItemIcon>
                    <ListItemText>My Profile</ListItemText>
                </MenuItem>
                <MenuItem component={Link} to={`/my-orders`} onClick={handleClose}>
                    <ListItemIcon>
                        <Receipt />
                    </ListItemIcon>
                    <ListItemText>My orders</ListItemText>
                </MenuItem>
                <MenuItem component={Link} to={`/change-password`} onClick={handleClose}>
                    <ListItemIcon>
                        <Password />
                    </ListItemIcon>
                    <ListItemText>Change password</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => {
                    handleLogout();
                    handleClose();
                    navigate('/login');
                }}>
                    <ListItemIcon>
                        <Logout />
                    </ListItemIcon>
                    <ListItemText>Logout</ListItemText>
                </MenuItem>
            </Menu>
        </Box>
    );
}
