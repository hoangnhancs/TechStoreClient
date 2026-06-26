import { Box, Button, IconButton, Paper, Stack, Typography, Tab, Tabs, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useNotificationContext } from "../../app/context/notificationContext";
import NotificationItemInPage from "./NotificationItemInPage";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../hooks";
import React from "react";
import { useDispatch } from "react-redux";
import { setNotiCreateAtSort, setNotiStatusFilter, setNotiTypeFilter } from "../filter/filterSlice";
import { UserNotification } from "../../lib/types";
import CloseIcon from '@mui/icons-material/Close';
import { NotificationSignalRService } from "../../app/api/notificationSignalRService";
import DeleteIcon from '@mui/icons-material/Delete';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ForumIcon from '@mui/icons-material/Forum';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import Pagination from '@mui/material/Pagination';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

export default function NotificationPage() {
  const { myNotifications } = useNotificationContext();
  const reduxNotiCreatedAtSort = useAppSelector(state => state.filter.notiCreateAtSort);
  const [selectedSortNotiCreatedAt, setSelectedSortNotiCreatedAt] = useState<'asc' | 'desc'>(reduxNotiCreatedAtSort);
  
  const reduxNotiStatusFilter = useAppSelector(state => state.filter.notiStatusFilter);
  const [selectedNotiStatusFilter, setSelectedNotiStatusFilter] = useState<'read' | 'unread' | 'all'>(reduxNotiStatusFilter);
  
  const reduxNotiTypeFilter = useAppSelector(state => state.filter.notiTypeFilter);
  const [selectedNotiTypeFilter, setSelectedNotiTypeFilter] = useState<'all' | 'system' | 'order' | 'payment' | 'interaction' | 'promotion'>(reduxNotiTypeFilter);
  
  const [selectedNoti, setSelectedNoti] = useState<UserNotification[]>([]);
  const [isSelectMode, setIsSelectMode] = useState<boolean>(false);
  const dispath = useDispatch();

  // Pagination states
  const [page, setPage] = useState<number>(1);
  const itemsPerPage = 8;

  // Reset page when filters or sorting changes
  useEffect(() => {
    setPage(1);
  }, [selectedSortNotiCreatedAt, selectedNotiStatusFilter, selectedNotiTypeFilter]);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const toogleSetSelectedNoti = (noti: UserNotification) => {
    if (selectedNoti.find((item) => item.id === noti.id)) {
      setSelectedNoti(selectedNoti.filter((item) => item.id !== noti.id));
    } else {
      setSelectedNoti([...selectedNoti, noti]);
    }
  }

  const handleMarkAsReadSelectedNotifications = () => {
    if (selectedNoti.length > 0) {
      NotificationSignalRService.markAsReadNotifications(selectedNoti.map((noti) => noti.id));
      setSelectedNoti([]);
    }
  }

  const handleDeteleSelectedNotifications = () => {
    if (selectedNoti.length > 0) {
      NotificationSignalRService.deleteNotifications(selectedNoti.map(noti => noti.id))
      setSelectedNoti([]);
    }
  }

  const handleSwitchFilter = () => {
    setIsSelectMode(false);
    setSelectedNoti([]);
  }

  const canClickMarkRead = () => {
    if (selectedNoti.length > 0) {  
      return selectedNoti.every((noti) => !noti.isRead);
    }
    return false;
  }

  // Category mapping helper (accounting for string names or integer enum indices)
  const matchCategory = (category: string | number, target: string): boolean => {
    if (category === undefined || category === null) return false;
    const catStr = category.toString().toLowerCase();
    switch (target.toLowerCase()) {
      case "system":
        return catStr === "system" || catStr === "0";
      case "order":
        return catStr === "order" || catStr === "1";
      case "payment":
        return catStr === "payment" || catStr === "2";
      case "interaction":
        return catStr === "interaction" || catStr === "3";
      case "promotion":
        return catStr === "promotion" || catStr === "4";
      default:
        return false;
    }
  };

  const filteredNotifications = React.useMemo(() => {
    if (myNotifications === null || myNotifications.length === 0) {
      return [];
    }

    let tmp = [...myNotifications];

    if (selectedSortNotiCreatedAt === 'asc') {
      tmp.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else {
      tmp.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    switch (selectedNotiStatusFilter) {
      case 'all':
        break;
      case 'unread':
        tmp = tmp.filter((noti) => !noti.isRead);
        break;
      case 'read':
        tmp = tmp.filter((noti) => noti.isRead);
        break;
      default: 
        break;
    }

    if (selectedNotiTypeFilter !== 'all') {
      tmp = tmp.filter((noti) => matchCategory(noti.category, selectedNotiTypeFilter));
    }
    
    return tmp;
  }, [selectedSortNotiCreatedAt, myNotifications, selectedNotiStatusFilter, selectedNotiTypeFilter]);

  const pageCount = Math.ceil(filteredNotifications.length / itemsPerPage);
  const paginatedNotifications = React.useMemo(() => {
    return filteredNotifications.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  }, [filteredNotifications, page]);

  const unreadCount = myNotifications.filter(n => !n.isRead).length;

  return (
    <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
      <Box p={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box display="flex" alignItems="center" gap={1.5}>
            <Typography variant="h5" fontWeight="bold">
              Thông báo
            </Typography>
            {unreadCount > 0 && (
              <Box
                sx={{
                  bgcolor: 'error.main',
                  color: 'white',
                  borderRadius: '12px',
                  px: 1.5,
                  py: 0.25,
                  fontSize: '13px',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 5px rgba(239, 68, 68, 0.2)'
                }}
              >
                {unreadCount} chưa đọc
              </Box>
            )}
          </Box>
        </Box>

        {/* Categories Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs
            value={selectedNotiTypeFilter}
            onChange={(_e, value) => {
              setSelectedNotiTypeFilter(value);
              dispath(setNotiTypeFilter(value));
              handleSwitchFilter();
            }}
            variant="scrollable"
            scrollButtons="auto"
            textColor="primary"
            indicatorColor="primary"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                minWidth: 100,
                fontWeight: 600,
                fontSize: '14px',
                py: 1.5,
              }
            }}
          >
            <Tab value="all" label="Tất cả" icon={<NotificationsIcon />} iconPosition="start" />
            <Tab value="system" label="Hệ thống" icon={<SettingsIcon />} iconPosition="start" />
            <Tab value="order" label="Đơn hàng" icon={<ShoppingBagIcon />} iconPosition="start" />
            <Tab value="payment" label="Thanh toán" icon={<CreditCardIcon />} iconPosition="start" />
            <Tab value="interaction" label="Tương tác" icon={<ForumIcon />} iconPosition="start" />
            <Tab value="promotion" label="Khuyến mãi" icon={<LocalOfferIcon />} iconPosition="start" />
          </Tabs>
        </Box>

        {/* Toolbar (Status Filter, Sorting & Actions) */}
        <Box 
          display="flex" 
          flexDirection={{ xs: 'column', sm: 'row' }} 
          gap={2} 
          justifyContent="space-between" 
          alignItems={{ xs: 'stretch', sm: 'center' }}
          mb={3}
        >
          {/* Status Filter */}
          <Box display="flex" alignItems="center" gap={1}>
            <ToggleButtonGroup
              value={selectedNotiStatusFilter}
              exclusive
              onChange={(_e, value) => {
                if (value !== null) {
                  setSelectedNotiStatusFilter(value);
                  dispath(setNotiStatusFilter(value));
                  handleSwitchFilter();
                }
              }}
              size="small"
              color="primary"
              sx={{
                '& .MuiToggleButton-root': {
                  px: 2,
                  py: 0.5,
                  borderRadius: '20px',
                  border: '1px solid #ccc',
                  mx: 0.25,
                  fontSize: '13px',
                  textTransform: 'none',
                  fontWeight: 500,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'white',
                    border: '1px solid transparent',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    }
                  }
                }
              }}
            >
              <ToggleButton value="all">Tất cả</ToggleButton>
              <ToggleButton value="unread">Chưa xem</ToggleButton>
              <ToggleButton value="read">Đã xem</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Sort & Select actions */}
          <Box display="flex" alignItems="center" justifyContent="flex-end" gap={1.5}>
            {/* Sort Toggle Group */}
            <ToggleButtonGroup
              value={selectedSortNotiCreatedAt}
              exclusive
              onChange={(_e, value) => {
                if (value !== null) {
                  setSelectedSortNotiCreatedAt(value);
                  dispath(setNotiCreateAtSort(value));
                }
              }}
              size="small"
              color="primary"
              sx={{
                '& .MuiToggleButton-root': {
                  px: 1.5,
                  py: 0.5,
                  borderRadius: '20px',
                  fontSize: '13px',
                  textTransform: 'none',
                  fontWeight: 500,
                }
              }}
            >
              <ToggleButton value="desc" aria-label="newest">
                <Box display="flex" alignItems="center" gap={0.5}>
                  Mới nhất <ArrowDownwardIcon sx={{ fontSize: '14px' }} />
                </Box>
              </ToggleButton>
              <ToggleButton value="asc" aria-label="oldest">
                <Box display="flex" alignItems="center" gap={0.5}>
                  Cũ nhất <ArrowUpwardIcon sx={{ fontSize: '14px' }} />
                </Box>
              </ToggleButton>
            </ToggleButtonGroup>

            {/* Select mode button */}
            {isSelectMode ? (
              <IconButton 
                size="small" 
                onClick={() => { setIsSelectMode(false); setSelectedNoti([]) }}
                sx={{ border: '1px solid #ccc', p: 0.5 }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            ) : (
              <Button 
                variant="outlined" 
                size="small" 
                onClick={() => setIsSelectMode(true)}
                sx={{ borderRadius: '20px', textTransform: 'none', px: 2 }}
              >
                Chọn
              </Button>
            )}
          </Box>
        </Box>

        {/* Selected Batch Actions Row */}
        {isSelectMode && (
          <Box 
            display="flex" 
            flexWrap="wrap"
            alignItems="center" 
            justifyContent="space-between" 
            p={1.5} 
            mb={2}
            sx={{ bgcolor: '#f5f7fa', borderRadius: 2 }}
          >
            <Box display="flex" gap={1}>
              <Button
                size="small"
                variant="text"
                onClick={() => setSelectedNoti(filteredNotifications)}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                Chọn tất cả ({filteredNotifications.length})
              </Button>
              <Button
                size="small"
                variant="text"
                onClick={() => setSelectedNoti([])}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                Bỏ chọn
              </Button>
            </Box>

            {selectedNoti.length > 0 && (
              <Box display="flex" gap={1.5}>
                <Button 
                  variant="contained" 
                  color="error" 
                  size="small"
                  startIcon={<DeleteIcon />} 
                  onClick={handleDeteleSelectedNotifications}
                  sx={{ textTransform: 'none', borderRadius: '4px' }}
                >
                  Xóa ({selectedNoti.length})
                </Button>
                <Button 
                  variant="contained" 
                  color="success" 
                  size="small"
                  startIcon={<MarkEmailReadIcon />} 
                  disabled={!canClickMarkRead()} 
                  onClick={handleMarkAsReadSelectedNotifications}
                  sx={{ textTransform: 'none', borderRadius: '4px' }}
                >
                  Đọc ({selectedNoti.length})
                </Button>
              </Box>
            )}
          </Box>
        )}

        {/* Notifications List Stack */}
        <Stack spacing={0} divider={<Box sx={{ borderBottom: "1px solid #eee" }} />}>
          {paginatedNotifications.length === 0 ? (
            <Box py={8} textAlign="center">
              <Typography color="text.secondary" variant="body1">
                Không có thông báo nào trong mục này.
              </Typography>
            </Box>
          ) : (
            paginatedNotifications.map((noti, i) => (
              <NotificationItemInPage 
                onChangeSelectedNotification={toogleSetSelectedNoti} 
                selectMode={isSelectMode} 
                isChoose={selectedNoti.some((item) => item.id === noti.id)}
                key={noti.id || i} 
                notification={noti} 
              />
            ))
          )}
        </Stack>

        {/* Pagination Controls */}
        {pageCount > 1 && (
          <Box display="flex" justifyContent="center" mt={4} mb={1}>
            <Pagination 
              count={pageCount} 
              page={page} 
              onChange={handlePageChange} 
              color="primary" 
              shape="rounded"
              size="medium"
            />
          </Box>
        )}
      </Box>
    </Paper>
  );
}
