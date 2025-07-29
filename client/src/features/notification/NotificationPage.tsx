import { Box, Button, TextField } from "@mui/material";
import { useNotificationContext } from "../../app/context/notificationContext"
import { NotificationSignalRService } from "../../app/api/notificationSignalRService";
import { useEffect, useState } from "react";
import { useGetCurrentUserQuery } from "../user/userApi";


export default function NotificationPage() {
    const { notifications } = useNotificationContext();
    const { data: currentUser } = useGetCurrentUserQuery();  
    const handleSendNotification = async (title: string, message: string, link: string | undefined, receivedId: string, senderId: string) => {
        await NotificationSignalRService.sendNotification(title, message, link, receivedId, senderId);
    }
    const [count, setCount] = useState(0);
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
            <Button onClick={() => {
                handleSendNotification(`test ${count}`, `test message ${count}`, "test link", "047828c7-c38b-4c9c-a3e3-8ce7e01daeae", currentUser?.id || "");
                setCount(prev => prev + 1);
            }}>
                submit
            </Button>
        </Box>
    </>
  )
}