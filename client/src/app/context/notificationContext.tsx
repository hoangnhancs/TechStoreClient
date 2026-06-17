import { createContext, useContext } from "react";
import { UserNotification } from "../../lib/types";

type NotificationContextType = {
  myNotifications: UserNotification[];
  onlineNotifications: UserNotification[];
};

export const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotificationContext = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useNotificationContext must be used within a NotificationProvider");
    }
    return context;
};
