import { Box, Button, TextField } from "@mui/material";
import { useNotificationContext } from "../../app/context/notificationContext"
import { NotificationSignalRService } from "../../app/api/notificationSignalRService";
import { useEffect } from "react";


export default function NotificationPage() {
    const { notifications } = useNotificationContext();
    const handleSendNotification = async (title: string, message: string, link: string | undefined, receivedId: string) => {
        await NotificationSignalRService.sendNotification(title, message, link, receivedId);
    }
    useEffect(() => {
        console.log("notifications updated", notifications);
    }, [notifications])
  return (
    <>
        {notifications.map((notification, index) => (
            <div key={index}>{notification.message}</div>
        ))}
        <Box>
            <TextField label="Message">

            </TextField>
            <TextField label="Title">

            </TextField>
            <TextField>

            </TextField>
            <Button onClick={() => handleSendNotification("test", "test", "test", "047828c7-c38b-4c9c-a3e3-8ce7e01daeae")}>
                submit
            </Button>
        </Box>
    </>
  )
}