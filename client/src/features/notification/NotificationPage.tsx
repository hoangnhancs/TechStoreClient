import { Box, TextField } from "@mui/material";
import { useNotificationContext } from "../../app/context/notificationContext"

export default function NotificationPage() {
    const { allNotifications: allNotifications, onlineNotifications: onlineNotifications } = useNotificationContext();
    // const { data: currentUser } = useGetCurrentUserQuery();  
    // const handleSendNotification = async (title: string, message: string, link: string | undefined, receivedId: string | undefined, groupId: string | undefined, senderId: string) => {
    //     await NotificationSignalRService.sendNotification(title, message, link, receivedId, groupId, senderId);
    // }
    // const [count, setCount] = useState(0);

  return (
    <>
        {allNotifications.map((notification, index) => (
            <div key={index}>{notification.message}</div>
        ))}
        <Box>
            <TextField label="Message">

            </TextField>
            <TextField label="Title">

            </TextField>
            <TextField>

            </TextField>
            {/* <Button onClick={() => {
                handleSendNotification(`test ${count}`, `test message ${count}`, "test link", undefined, "e605dfb1-7540-4ae7-8cda-96f8dc1525a6", currentUser?.id || "");
                setCount(prev => prev + 1);
            }}>
                submit
            </Button> */}
            {onlineNotifications.map((notification, index) => (
                <div key={index}>{notification.message}</div>
            ))}
        </Box>
    </>
  )
}