import { useEffect, useState } from "react";
import { UserNotification } from "../../lib/types";
import { NotificationSignalRService } from "../api/notificationSignalRService";
import { NotificationContext } from "./notificationContext";
import { useGetCurrentUserQuery } from "../../features/user/userApi";
// import { useFetchAdminNotificationGroupQuery } from "../api/notificationGroupsApi";


export const NotificationProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [myNotifications, setMyNotifications] = useState<UserNotification[]>([]);
    const [onlineNotifications, setOnlineNotifications] = useState<UserNotification[]>([]);
    const { data: currentUser } = useGetCurrentUserQuery();
    // const { data: adminGroup } = useFetchAdminNotificationGroupQuery(undefined, { skip: !currentUser?.id });
    // console.log("admin group", adminGroup)
    useEffect(() => {
        if (!currentUser?.id) return; //dam bao user valid moi tao notification connection
        
        const setupConnection = async () => {
            await NotificationSignalRService.createHubConnection()

            NotificationSignalRService.onReceiveNewNotification((notification) => {
                console.log("Received new notification:", notification);
                setMyNotifications((prevNotifications) => [notification, ...prevNotifications]);
                setOnlineNotifications((prevNotifications) => [notification, ...prevNotifications]);
                setTimeout(() => {
                    setOnlineNotifications((prevNotifications) => prevNotifications.filter((n) => n.id !== notification.id));
                }, 5000)
                
            })

            NotificationSignalRService.loadAllNotifications((allNotifications) => {
                setMyNotifications(allNotifications)
            });

            NotificationSignalRService.onReceiveReadNotifications((notificationIds) => {
                setMyNotifications((prevNotifications) => prevNotifications.map((notification) => {
                    if (notificationIds.includes(notification.id)) {
                        return { ...notification, isRead: true };
                    }
                    return notification;
                }));
            });

            NotificationSignalRService.onReceiveDeletedNotifications((notificationIds) => {
                setMyNotifications((prevNotifications) => prevNotifications.filter((notification) => !notificationIds.includes(notification.id)));
            })
        } 

        setupConnection();
        return () =>  {
            NotificationSignalRService.stopConnection()
            console.log("stop connection")
        }   
    }, [currentUser?.id, currentUser?.notificationGroupIds])
    return (
        <NotificationContext.Provider value={{myNotifications: myNotifications, onlineNotifications: onlineNotifications}}>
            {children}
        </NotificationContext.Provider>
    )
}