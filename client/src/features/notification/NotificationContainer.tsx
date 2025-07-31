
import { useNotificationContext } from "../../app/context/notificationContext";
import { Box } from "@mui/material";
import NotificationItem from "./NotificationItem";

export const NotificationContainer = () => {
  const { onlineNotifications: onlineNotifications } = useNotificationContext();

  return (
    <Box
      sx={{
        position: "fixed",       // hoặc fixed nếu cần hiển thị độc lập theo viewport
        bottom: 20,                 // điều chỉnh theo vị trí bell hoặc theo ý bạn
        left: 20,                   // căn trái
        width: 320,
        maxHeight: 400,
        overflowY: "auto",
        backgroundColor: 'transparent', // trong suốt nhẹ
        borderRadius: 2,
        zIndex: 1500,
        p: 1,
        display: "flex",
        flexDirection: "column",
        gap: 0.5
      }}
    >
      {
        onlineNotifications.map((noti) => (
          <NotificationItem key={noti.id} notification={noti} />
        )
      )}
    </Box>
  );
};
