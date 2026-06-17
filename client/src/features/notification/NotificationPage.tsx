import { Box, Button, IconButton, Paper, Stack, styled, Typography } from "@mui/material";
import { useNotificationContext } from "../../app/context/notificationContext";
import NotificationItemInPage from "./NotificationItemInPage";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../hooks";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import React from "react";
import { useDispatch } from "react-redux";
import { setNotiCreateAtSort, setNotiStatusFilter, setNotiTypeFilter } from "../filter/filterSlice";
import { UserNotification } from "../../lib/types";
import CloseIcon from '@mui/icons-material/Close';
import { NotificationSignalRService } from "../../app/api/notificationSignalRService";
import DeleteIcon from '@mui/icons-material/Delete';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';

export const StyledButton = styled(Button, {shouldForwardProp: (prop) => prop !== 'active'})<{ active: boolean }>(({ active }) => ({
  backgroundColor: 'white',
  color: active ? 'rgb(59, 130, 246)' : 'black',
  borderRadius: 40,
  height: 30,
  width: 160,
  border: active
    ? '1px solid rgb(59, 130, 246)'
    : '1px solid #ccc',
  alignContent: 'center',
}));

export default function NotificationPage() {
  const { myNotifications } = useNotificationContext();
  const reduxNotiCreatedAtSort = useAppSelector(state => state.filter.notiCreateAtSort);
  const [selectedSortNotiCreatedAt, setSelectedSortNotiCreatedAt] = useState<'asc' | 'desc'>(reduxNotiCreatedAtSort);
  const reduxNotiStatusFilter = useAppSelector(state => state.filter.notiStatusFilter);
  const [selectedNotiStatusFilter, setSelectedNotiStatusFilter] = useState<'read' | 'unread' | 'all'>(reduxNotiStatusFilter);
  const reduxNotiTypeFilter = useAppSelector(state => state.filter.notiTypeFilter);
  const [selectedNotiTypeFilter, setSelectedNotiTypeFilter] = useState<'all' | 'review' | 'comment' | 'system'>(reduxNotiTypeFilter);
  const [selectedNoti, setSelectedNoti] = useState<UserNotification[]>([]);
  const [isSelectMode, setIsSelectMode] = useState<boolean>(false);
  const dispath = useDispatch();
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
    switch (selectedNotiTypeFilter) {
      case 'all':
        break;
      case 'review':
        tmp = tmp.filter((noti) => noti.type.toLowerCase() === 'review');
        break;
      case 'comment':
        tmp = tmp.filter((noti) => noti.type.toLowerCase() === 'comment');
        break;
      case 'system':
        tmp = tmp.filter((noti) => noti.type.toLowerCase() === 'system');
        break;
      default:
        break;
      }   
    return tmp;
  }, [selectedSortNotiCreatedAt, myNotifications, selectedNotiStatusFilter, selectedNotiTypeFilter]);
  useEffect(() => {
    console.log('selectedNoti', selectedNoti);
  }, [selectedNoti]);
  return (
    <Paper elevation={3}>
      <Box p={3} >
        <Typography variant="h5" mb={3}>
          Thông báo
        </Typography>
        <Box display={"flex"} mb={2} alignItems={"center"} >
          <Typography sx={{ mr: 3 }} variant="h6">Sắp xếp theo:</Typography>
          <StyledButton   
            active={selectedSortNotiCreatedAt === 'asc'}      
            sx={{  
              mr: 1,  
            }}
            onClick={() =>{ setSelectedSortNotiCreatedAt('asc'); dispath(setNotiCreateAtSort('asc'))}}
            endIcon={<ArrowUpwardIcon />}
          >  
            Cũ nhất
          </StyledButton>
          <StyledButton   
            active={selectedSortNotiCreatedAt === 'desc'}         
            sx={{  
              mr: 1
            }}  
            onClick={() =>{ setSelectedSortNotiCreatedAt('desc'); dispath(setNotiCreateAtSort('desc'))}}
            endIcon={<ArrowDownwardIcon />}
          >  
            Mới nhất
          </StyledButton>
        </Box>
        <Box display={"flex"} mb={2} alignItems={"center"} justifyContent={"space-between"}>
          <Box display={"flex"} alignItems={"center"}>
            <Typography sx={{ mr: 3 }} variant="h6">Lọc thông báo theo:</Typography>
            <StyledButton     
              active={selectedNotiStatusFilter === 'all'}    
              sx={{  
                mr: 1, 
                width: 100
              }}  
              onClick={() =>{ setSelectedNotiStatusFilter('all'); dispath(setNotiStatusFilter('all')); handleSwitchFilter()}}
            >  
              Tất cả
            </StyledButton>
            <StyledButton    
              active={selectedNotiStatusFilter === 'read'}     
              sx={{  
                mr: 1,
                width: 100
              }}
              onClick={() =>{ setSelectedNotiStatusFilter('read'); dispath(setNotiStatusFilter('read')); handleSwitchFilter ()}}
            >  
              Đã xem
            </StyledButton>
            <StyledButton    
              active={selectedNotiStatusFilter === 'unread'}     
              sx={{  
                mr: 1,
                width: 100
              }}
              onClick={() =>{ setSelectedNotiStatusFilter('unread'); dispath(setNotiStatusFilter('unread')); handleSwitchFilter()}}
            >  
              Chưa xem
            </StyledButton>
          </Box>
          <Box display={"flex"} alignItems={"center"}>
            <StyledButton    
              active={selectedNotiTypeFilter === 'all'}     
              sx={{  
                mr: 1,
                width: 100
              }}
              onClick={() =>{ setSelectedNotiTypeFilter('all'); dispath(setNotiTypeFilter('all')); handleSwitchFilter()}}
            >  
              Tất cả
            </StyledButton>
            <StyledButton    
              active={selectedNotiTypeFilter === 'comment'}     
              sx={{  
                mr: 1,
                width: 100
              }}
              onClick={() =>{ setSelectedNotiTypeFilter('comment'); dispath(setNotiTypeFilter('comment')); handleSwitchFilter()}}
            >  
              Bình luận
            </StyledButton>
            <StyledButton    
              active={selectedNotiTypeFilter === 'review'}     
              sx={{  
                mr: 1,
                width: 100
              }}
              onClick={() =>{ setSelectedNotiTypeFilter('review'); dispath(setNotiTypeFilter('review')); handleSwitchFilter()}}
            >  
              Đánh giá
            </StyledButton>
            <StyledButton    
              active={selectedNotiTypeFilter === 'system'}     
              sx={{  
                mr: 1,
                width: 100
              }}
              onClick={() =>{ setSelectedNotiTypeFilter('system'); dispath(setNotiTypeFilter('system')); handleSwitchFilter()}}
            >  
              Hệ thống
            </StyledButton>
          </Box>    
        </Box>
        <Box display={"flex"} justifyContent={"space-between"} mb={1}>
          <Box>
            {isSelectMode && (
              <Box>
                <Button
                  onClick={() => {
                    setSelectedNoti(filteredNotifications);
                  }}
                >
                  Chọn tất cả
                </Button>
                <Button
                  onClick={() => {
                    setSelectedNoti([]);
                  }}
                >
                  Bỏ chọn tất cả
                </Button>
              </Box>
            )}
          </Box>
          {isSelectMode ? (
            <IconButton onClick={() => {setIsSelectMode(false); setSelectedNoti([])}}>
              <CloseIcon />
            </IconButton>
          ) : (
            <Button onClick={() => setIsSelectMode(true)}>
              Chọn 
            </Button>
          )}
        </Box>
        <Box display={"flex"} gap={2} alignItems={"center"}>
          {selectedNoti.length > 0 && 
            <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={handleDeteleSelectedNotifications}>
              Xóa tất cả
            </Button>
          }
          {selectedNoti.length > 0 && 
            <Button variant="outlined" color="success" startIcon={<MarkEmailReadIcon />} disabled={!canClickMarkRead()} onClick={handleMarkAsReadSelectedNotifications}>
              Đánh dấu là đã đọc
            </Button>
          }
        </Box>
        <Stack spacing={2} mt={2} divider={<Box sx={{ borderBottom: "1px solid #eee" }} />}>
          {filteredNotifications.length === 0 ? (
            <Typography textAlign="center" color="text.secondary">
              Không có thông báo nào.
            </Typography>
          ) : (
            filteredNotifications.map((noti, i) => (
              <NotificationItemInPage 
                onChangeSelectedNotification={toogleSetSelectedNoti} 
                selectMode={isSelectMode} 
                isChoose={selectedNoti.some((item) => item.id === noti.id)}
                key={i} 
                notification={noti} />
            ))
          )}
        </Stack>
      </Box>
    </Paper>
  );
}
