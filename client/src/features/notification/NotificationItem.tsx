import { Box, Typography } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications"; // hoặc thay bằng icon khác
import { UserNotification } from "../../lib/types";
import { useNavigate } from "react-router";
import { formatVNDate } from "../../lib/util/util";
import { NotificationSignalRService } from "../../app/api/notificationSignalRService";

interface Props {
  notification: UserNotification
}

const NotificationItem = ({ notification }: Props) => {
  console.log("notification: ",notification);
  const navigate = useNavigate();
  return (
    <Box
      onClick={() => {
        navigate(notification.link || "/")
        NotificationSignalRService.markAsReadNotifications([notification.id]);
      }}
      sx={{
        backgroundColor: "#102a43", 
        borderRadius: 2,
        padding: 1.5,
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        '&:hover': {
          opacity: 0.9
        }
      }}
    >
      {/* Header */}
      <Box 
        sx={{ 
          display: "flex", 
          alignItems: "center", 
          mb: 0.5, 
          justifyContent: "space-between" 
        }}
      >
        <Box display={"flex"} alignItems={"center"}>
          <NotificationsIcon sx={{ fontSize: 18, color: "#00b0ff", mr: 0.5 }} />
          <Typography sx={{ fontWeight: 600, fontSize: 13, mr: 1 }}>{notification.title}</Typography>
        </Box>
        <Typography sx={{ fontSize: 12, opacity: 0.7 }}>{formatVNDate(notification.createdAt, "hhmm")}</Typography>
      </Box>

      {/* Title */}
      <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{notification.senderDisplayName}</Typography>

      {/* Message */}
      <Typography sx={{ fontSize: 13, opacity: 0.85 }}>{notification.message}</Typography>
    </Box>
  );
};

export default NotificationItem;
