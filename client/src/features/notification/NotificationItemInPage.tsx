import { Avatar, Box, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Notification } from "../../lib/types";
import { useNavigate } from "react-router";
import { NotificationSignalRService } from "../../app/api/notificationSignalRService";
import { Checkbox } from "@mui/material";
import { useState } from "react";

interface Props {
  notification: Notification;
  selectMode?: boolean;
  isChoose?: boolean
  onChangeSelectedNotification?: (notification: Notification) => void
}

export default function NotificationItemInPage({ notification, selectMode, isChoose, onChangeSelectedNotification }: Props) {
  const navigate = useNavigate();
  const [anchorE1, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorE1);
  const handleClick = () => {
    if (!notification.isRead) {
      NotificationSignalRService.markAsReadNotifications([notification.id]);
    }
    navigate(notification.link || "/");
  };
   

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
        bgcolor: notification.isRead ? "#f0f0f0" : "#ffffff",
        transition: "background 0.2s",
        "&:hover": {
          bgcolor: "#f0f4ff",
          cursor: "pointer",
        },
      }}
      onClick={handleClick}
    >
      {selectMode && <Checkbox
        checked={isChoose}
        onClick={(e) => {
          e.stopPropagation();
          onChangeSelectedNotification?.(notification);
        }}
      >

      </Checkbox>}
      <Box position="relative" mr={2}>
        <Avatar src={notification.senderImageUrl} sx={{ width: 48, height: 48 }} />
        {!notification.isRead && (
          <Box
            sx={{
              width: 10,
              height: 10,
              bgcolor: "primary.main",
              borderRadius: "50%",
              position: "absolute",
              bottom: 2,
              right: 2,
            }}
          />
        )}
      </Box>

      <Box flex={1} overflow="hidden">
        <Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
          <Typography fontSize={15} fontWeight={500}>
            {notification.senderName}
          </Typography>
          <Typography fontSize={15} fontWeight="bold">
            {notification.title}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {notification.message}
        </Typography>
        <Typography variant="caption" color="text.disabled">
          {formatDistanceToNow(new Date(notification.createdAt), {
            addSuffix: true,
            locale: vi,
          })}
        </Typography>
      </Box>

      <Box display="flex" alignItems="center" ml={1}>
        <ChatBubbleOutlineIcon fontSize="small" color="action" />
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation(); // Ngăn lan sự kiện
            setAnchorEl(e.currentTarget);
            console.log("Clicked more options");
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
            top: 6,
            right: 10,
            fontSize: 11,
            color: "info.main",
            fontStyle: "italic",
          }}
        >
          Đã xem
        </Typography>
      )}
      <Menu
        open={open}
        anchorEl={anchorE1}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        onClick={(e) => e.stopPropagation()}
        sx={{
          elevation: 3, // đổ bóng
          sx: {
            borderRadius: 2, // bo góc
            minWidth: 180,
            mt: 1, // margin top
            py: 1, // padding dọc
          },
        }}
      >
        <MenuItem
          onClick={() => {
            console.log("Xóa bình luận", notification.id);
            NotificationSignalRService.deleteNotifications([notification.id]);
            setAnchorEl(null);
          }}
          sx={{
            fontSize: 14,
            px: 2.5,
            "&:hover": {
              bgcolor: "error.lighter",
              color: "error.main",
            },
          }}
        >
          Xóa bình luận
        </MenuItem>
        <MenuItem
          onClick={() => {
            console.log("Đánh dấu là đã đọc", notification.id);
            NotificationSignalRService.markAsReadNotifications([notification.id]);
            setAnchorEl(null);
          }}
          sx={{
            fontSize: 14,
            px: 2.5,
            "&:hover": {
              bgcolor: "error.lighter",
              color: "error.main",
            },
          }}
          disabled={notification.isRead}
        >
          Đánh dấu là đã đọc
        </MenuItem>
        
      </Menu>
    </Box>
  );
}
