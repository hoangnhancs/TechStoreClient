import { Avatar, Box, IconButton, Stack, Typography } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Notification } from "../../lib/types";
import { useNavigate } from "react-router";

interface Props {
  notification: Notification
}

export default function NotificationItem({ notification }: Props) {
  const navigate = useNavigate();
  return (
    <Stack
      direction="row"
      spacing={2}
      p={2}
      borderRadius={2}
      sx={{
        bgcolor: !notification.isRead ? "#f5f5f5" : "#e1e8ecff",
        "&:hover": { bgcolor:  "#f5f5f5", cursor: "pointer" },
        boxShadow: 1,
      }}
      alignItems="center"
      onClick={() => navigate(notification.link || "/")}
    >
      <Box position="relative">
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

      <Box flex={1}>
        <Typography fontSize={15} color="text.primary" gap={1}>
          <b>{notification.senderName}</b> {notification.title}
        </Typography>
        <Typography>
          {notification.message}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {formatDistanceToNow(new Date(notification.createdAt), {
            addSuffix: true,
            locale: vi,
          })}
        </Typography>
      </Box> 
      <Box display="flex" alignItems="center" gap={1}>
        <ChatBubbleOutlineIcon fontSize="small" color="action" />
        <IconButton size="small">
          <MoreHorizIcon color="action" />
        </IconButton>
      </Box>
    </Stack>
  );
}
