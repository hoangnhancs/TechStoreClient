import { useEffect, useState } from "react";
import { Notification } from "../../lib/types";
import { NotificationSignalRService } from "../api/notificationSignalRService";
import { NotificationContext } from "./notificationContext";
import { toast } from "react-toastify";

export const NotificationProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        const setupConnection = async () => {
            await NotificationSignalRService.createHubConnection()

            NotificationSignalRService.onReceiveNewNotification((notification) => {
                setNotifications((prevNotifications) => {console.log("new notes",[notification, ...prevNotifications]);return [notification, ...prevNotifications]});
                toast.success(notification.message);
                console.log("send notification success")
                
            })

            NotificationSignalRService.loadAllNotifications((allNotifications) => {
                console.log("load all notifications")
                setNotifications(allNotifications)
            });
        } 

        setupConnection();
        return () =>  {
            NotificationSignalRService.stopConnection()
            console.log("stop connection")
        }   
    }, [])
    return (
        <NotificationContext.Provider value={{notifications}}>
            {children}
            {notifications.map((notification, index) => <div key={index}>{notification.message}</div>)}
        </NotificationContext.Provider>
    )
}