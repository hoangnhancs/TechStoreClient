import { createContext, useContext } from "react";
import { Notification, NotificationGroup } from "../../lib/types";

type NotificationContextType = {
  allNotifications: Notification[];
  onlineNotifications: Notification[];
  adminGroup: NotificationGroup | undefined
};

export const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotificationContext = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotificationContext must be used within a NotificationProvider");
    }
    return context;
};
