import { Box, Stack, Typography } from "@mui/material";
import { useNotificationContext } from "../../app/context/notificationContext";
import NotificationItemInPage from "./NotificationItemInPage";

export default function NotificationPage() {
  const { allNotifications } = useNotificationContext();

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        Thông báo
      </Typography>

      <Stack spacing={1.5}>
        {allNotifications.length === 0 ? (
          <Typography>Không có thông báo nào.</Typography>
        ) : (
          allNotifications.map((noti, i) => (
            <NotificationItemInPage key={i} notification={noti} />
          ))
        )}
      </Stack>
    </Box>
  );
}
