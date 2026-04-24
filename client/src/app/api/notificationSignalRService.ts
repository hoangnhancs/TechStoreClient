import { Notification } from "../../lib/types";
import * as signalR from "@microsoft/signalr";

type NotificationCallback = (notification: Notification) => void;
type NotificationsCallback = (notifications: Notification[]) => void;

class NotificationSignalRServiceClass {
    private hubConnection: signalR.HubConnection | null = null;
    private notificationCallback: NotificationCallback | null = null;
    private notificationsReadCallBack: ((id: string[]) => void) | null = null;
    private notificationsDeletedCallBack: ((id: string[]) => void) | null = null;
    private isConnecting: boolean = false; 

    public createHubConnection = async (): Promise<void> => {
        if (this.isConnecting) {
            console.log("Connection notifications already in progress, waiting...");
            await new Promise((resolve) => setTimeout(resolve, 100));
            this.createHubConnection();
        }
        if (this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected) {
            return Promise.resolve();
        }
        try {
            this.isConnecting = true;
            const notificationHubUrl = import.meta.env.VITE_NOTIFICATION_URL;
            if (!notificationHubUrl) {
              throw new Error(
                "VITE_NOTIFICATION_URL is not defined in the environment variables."
              );
            }
            const newConnection = new signalR.HubConnectionBuilder()
                .withUrl(notificationHubUrl, {
                    withCredentials: true,
                    transport: signalR.HttpTransportType.WebSockets,
                    skipNegotiation: true,
                })
                .withAutomaticReconnect([0, 2000, 5000, 10000, 20000])
                .configureLogging(signalR.LogLevel.Debug)
                .build();
            newConnection.off("ReceiveNotification");
            newConnection.on("ReceiveNotification", (notification: Notification) => {
                if (this.notificationCallback) {
                    // console.log("Received notification: ", notification);
                    this.notificationCallback(notification);
                }
            })

            let retries = 3
            while (retries > 0) {
                try {
                    await newConnection.start();
                    this.hubConnection = newConnection;
                    await this.hubConnection.invoke("JoinNotificationGroup");
                    // console.log("Joined notification group");
                    break;
                } catch (error) {
                    retries--;
                    if (retries === 0) {
                      console.log(
                        "Notifications hub Failed to connect after multiple attempts:",
                        error
                      );
                      throw error;
                    }
                    console.warn(
                      `Notifications hub Connection attempt failed, retrying... (${retries} attempts left)`
                    );
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                }
            }
        } catch (error) {
            console.error("Notifications hub Error while starting connection: ", error);
            throw error;
        } finally {
            this.isConnecting = false;
        }
    }

    public stopConnection = async (): Promise<void> => {
        try {
            if (this.hubConnection) {
                if (this.hubConnection.state === signalR.HubConnectionState.Connected) {  
                    try {
                        await this.hubConnection.invoke("LeaveNotificationGroup");
                        // console.log("Left notification group");
                    } catch (error) {
                        console.log("Error when leaving notification group", error);
                    }
                }
                await this.hubConnection.stop();
            }
        } catch (error) {
            console.error("Notifications hub Error while stopping connection: ", error);
        } finally {
            this.hubConnection = null;
            this.notificationCallback = null;
        }
    }

    public loadAllNotifications = async (callback: NotificationsCallback): Promise<void> => {
        if (!this.hubConnection || this.hubConnection.state != signalR.HubConnectionState.Connected) {
            console.warn("Notifications hub not connected");
            return
        }
        this.hubConnection.off("ReceiveAllNotifications");
        this.hubConnection.on("ReceiveAllNotifications", (notifications: Notification[]) => {
            // console.log("Received all notifications: ", notifications);
            callback(notifications);
        })
        this.hubConnection
            .invoke("LoadAllNotifications")
            // .then(() => console.log("Notifications loaded"))
            .catch((err) => console.error("Error loading notifications: ", err));;
    }

    public onReceiveNewNotification = (callback: NotificationCallback): void => {
        this.notificationCallback = callback;
    } //noi component gan callback cho signalRservice notificationcallback

    public sendNotification = async (title: string, message: string, link: string | undefined, receivedId: string | undefined, groupId: string | undefined, senderId: string, commentResultId: string | undefined, reviewResultId: string | undefined, type: string): Promise<void> => {
        if (!this.hubConnection || this.hubConnection.state != signalR.HubConnectionState.Connected) {
            console.warn("Notifications hub not connected");
            return
        }
        this.hubConnection
            .invoke("SendNotification", title, message, link, receivedId, groupId, senderId, commentResultId, reviewResultId, type)
            .catch((err) => console.error("Error sending notification: ", err));
    }

    public markAsReadNotifications = async (notificationIds: string[]): Promise<void> => {
        if (!this.hubConnection || this.hubConnection.state != signalR.HubConnectionState.Connected) {
            console.warn("Notifications hub not connected");
            return
        }
        this.hubConnection
          .invoke("MarkAsReadListNotifications", notificationIds)
          .catch((err) => console.error("Error marking notifications as read: ", err));
    }

    public onReceiveReadNotifications = (callback: (id: string[]) => void): void => {
        this.notificationsReadCallBack = callback;
        if (this.hubConnection) {
            this.hubConnection.off("ReceiveNotificationsRead");
            this.hubConnection.on("ReceiveNotificationsRead", (notificationIds: string[]) => {
                if (this.notificationsReadCallBack) {
                    this.notificationsReadCallBack(notificationIds);
                }
            });
        }
    }

    public deleteNotifications = async (notificationIds: string[]): Promise<void> => {
        if (!this.hubConnection || this.hubConnection.state != signalR.HubConnectionState.Connected) {
            console.warn("Notifications hub not connected");
            return
        }
        this.hubConnection
          .invoke("DeleteListNotifications", notificationIds)
          .catch((err) => console.error("Error sending notification: ", err));
    }

    public onReceiveDeletedNotifications = (callback: (id: string[]) => void): void => {
        this.notificationsDeletedCallBack = callback;
        if (this.hubConnection) {
            this.hubConnection.off("ReceiveNotificationsDeleted");
            this.hubConnection.on("ReceiveNotificationsDeleted", (notificationIds: string[]) => {
                if (this.notificationsDeletedCallBack) {
                    this.notificationsDeletedCallBack(notificationIds);
                }
            });
        }
    }
}

export const NotificationSignalRService = new NotificationSignalRServiceClass();