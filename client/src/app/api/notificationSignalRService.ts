import { Notification } from "../../lib/types";
import * as signalR from "@microsoft/signalr";

type NotificationCallback = (notification: Notification) => void;
type NotificationsCallback = (notifications: Notification[]) => void;

class NotificationSignalRServiceClass {
    private hubConnection: signalR.HubConnection | null = null;
    private notificationCallback: NotificationCallback | null = null;
    private isConnecting: boolean = false; 

    public createHubConnection = async (): Promise<void> => {
        if (this.isConnecting) {
            console.log("Connection reviews already in progress, waiting...");
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
                "VITE_REVIEW_URL is not defined in the environment variables."
              );
            }
            const newConnection = new signalR.HubConnectionBuilder()
                .withUrl(notificationHubUrl, {
                    withCredentials: true,
                    transport: signalR.HttpTransportType.WebSockets,
                    skipNegotiation: true,
                })
                .withAutomaticReconnect([0, 2000, 5000, 10000, 20000])
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
                        "Reviews hub Failed to connect after multiple attempts:",
                        error
                      );
                      throw error;
                    }
                    console.warn(
                      `Reviews hub Connection attempt failed, retrying... (${retries} attempts left)`
                    );
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                }
            }
        } catch (error) {
            console.error("Reviews hub Error while starting connection: ", error);
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
    }

    public sendNotification = async (title: string, message: string, link: string | undefined, receivedId: string, senderId: string): Promise<void> => {
        if (!this.hubConnection || this.hubConnection.state != signalR.HubConnectionState.Connected) {
            console.warn("Notifications hub not connected");
            return
        }
        this.hubConnection
            .invoke("SendNotification", title, message, link, receivedId, senderId)
            // .then(() => console.log("Notification sent"))
            .catch((err) => console.error("Error sending notification: ", err));;
    }
}

export const NotificationSignalRService = new NotificationSignalRServiceClass();