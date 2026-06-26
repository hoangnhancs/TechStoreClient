import { Avatar, Box, IconButton, Menu, MenuItem, Typography, Checkbox } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { UserNotification } from "../../lib/types";
import { useNavigate } from "react-router";
import { NotificationSignalRService } from "../../app/api/notificationSignalRService";
import { useState } from "react";
import { buildNotificationLink } from "../../lib/util/util";
import { useAppSelector } from "../../hooks";
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ForumIcon from '@mui/icons-material/Forum';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

interface Props {
  notification: UserNotification;
  selectMode?: boolean;
  isChoose?: boolean
  onChangeSelectedNotification?: (notification: UserNotification) => void
}

const getCategoryDetails = (category: string | number) => {
  const catStr = category?.toString().toLowerCase();
  switch (catStr) {
    case "system":
    case "0":
      return { icon: <SettingsIcon sx={{ fontSize: 10, color: 'white' }} />, color: '#3b82f6', label: "Hệ thống" };
    case "order":
    case "1":
      return { icon: <ShoppingBagIcon sx={{ fontSize: 10, color: 'white' }} />, color: '#10b981', label: "Đơn hàng" };
    case "payment":
    case "2":
      return { icon: <CreditCardIcon sx={{ fontSize: 10, color: 'white' }} />, color: '#f59e0b', label: "Thanh toán" };
    case "interaction":
    case "3":
      return { icon: <ForumIcon sx={{ fontSize: 10, color: 'white' }} />, color: '#8b5cf6', label: "Tương tác" };
    case "promotion":
    case "4":
      return { icon: <LocalOfferIcon sx={{ fontSize: 10, color: 'white' }} />, color: '#ef4444', label: "Khuyến mãi" };
    default:
      return { icon: <NotificationsIcon sx={{ fontSize: 10, color: 'white' }} />, color: '#6b7280', label: "Thông báo" };
  }
};

export default function NotificationItemInPage({ notification, selectMode, isChoose, onChangeSelectedNotification }: Props) {
  const navigate = useNavigate();
  const [anchorE1, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorE1);
  const currentUser = useAppSelector((state) => state.user.currentUser);
  
  const handleClick = () => {
    if (!notification.isRead) {
      NotificationSignalRService.markAsReadNotifications([notification.id]);
    }
    const link = buildNotificationLink(notification, currentUser);
    if (link) {
      navigate(link);
    } 
  };

  const catDetails = getCategoryDetails(notification.category);

  return (
    <Box
      display="flex"
      alignItems="center"
      position="relative"
      pr={2}
      pl={selectMode ? 0 : 2}
      py={1.5}
      sx={{
        borderBottom: "1px solid #eee",
        borderLeft: notification.isRead ? "4px solid transparent" : `4px solid ${catDetails.color}`,
        bgcolor: notification.isRead ? "#fcfcfc" : "#ffffff",
        transition: "all 0.2s ease",
        "&:hover": {
          bgcolor: "#f4f7fe",
          cursor: "pointer",
        },
      }}
      onClick={handleClick}
    >
      {selectMode && (
        <Checkbox
          checked={isChoose}
          onClick={(e) => {
            e.stopPropagation();
            onChangeSelectedNotification?.(notification);
          }}
          sx={{ mr: 1 }}
        />
      )}
      <Box position="relative" mr={2}>
        <Avatar src={notification.senderImageUrl} sx={{ width: 48, height: 48, boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }} />
        {/* Category Badge Icon */}
        <Box
          sx={{
            position: 'absolute',
            bottom: -2,
            right: -2,
            width: 18,
            height: 18,
            borderRadius: '50%',
            bgcolor: catDetails.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid white',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
          }}
        >
          {catDetails.icon}
        </Box>
      </Box>

      <Box flex={1} overflow="hidden">
        <Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
          <Typography fontSize={14} fontWeight={600} color="text.primary">
            {notification.senderDisplayName}
          </Typography>
          <Typography fontSize={14} fontWeight={500} color="text.secondary">
            {notification.title}
          </Typography>
        </Box>
        <Typography 
          variant="body2" 
          color="text.primary" 
          fontWeight={notification.isRead ? 400 : 500} 
          sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", my: 0.25 }}
        >
          {notification.message}
        </Typography>
        <Typography variant="caption" color="text.disabled" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {(() => {
            const date = new Date(notification.createdAt);
            return isNaN(date.getTime())
              ? ""
              : formatDistanceToNow(date, { addSuffix: true, locale: vi });
          })()}
        </Typography>
      </Box>

      <Box display="flex" alignItems="center" gap={1} ml={1}>
        <Box
          sx={{
            fontSize: '10px',
            fontWeight: 600,
            px: 1,
            py: 0.25,
            borderRadius: '10px',
            bgcolor: `${catDetails.color}15`,
            color: catDetails.color,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            whiteSpace: 'nowrap'
          }}
        >
          {catDetails.label}
        </Box>
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation(); 
            setAnchorEl(e.currentTarget);
          }}
        >
          <MoreHorizIcon fontSize="small" />
        </IconButton>
      </Box>

      {notification.isRead && (
        <Typography
          variant="caption"
          sx={{
            position: "absolute",
            top: 4,
            right: 12,
            fontSize: 10,
            color: "text.disabled",
            fontStyle: "italic",
          }}
        >
          Đã đọc
        </Typography>
      )}
      
      <Menu
        open={open}
        anchorEl={anchorE1}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        onClick={(e) => e.stopPropagation()}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 2,
              minWidth: 160,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              mt: 0.5,
            }
          }
        }}
      >
        <MenuItem
          onClick={() => {
            NotificationSignalRService.deleteNotifications([notification.id]);
            setAnchorEl(null);
          }}
          sx={{
            fontSize: 13,
            py: 1,
            px: 2,
            color: 'error.main',
            "&:hover": {
              bgcolor: "error.lighter",
            },
          }}
        >
          Xóa thông báo
        </MenuItem>
        <MenuItem
          onClick={() => {
            NotificationSignalRService.markAsReadNotifications([notification.id]);
            setAnchorEl(null);
          }}
          sx={{
            fontSize: 13,
            py: 1,
            px: 2,
          }}
          disabled={notification.isRead}
        >
          Đánh dấu đã đọc
        </MenuItem>
      </Menu>
    </Box>
  );
}
