import * as signalR from '@microsoft/signalr';
import { OrderNotification } from "../../lib/types";

type OrderNotificationCallback = (message: OrderNotification) => void;

class OrderSignalRServiceClass {
    private hubConnection: signalR.HubConnection | null = null;
    private notificationCallback: OrderNotificationCallback | null = null;
    private isConnecting: boolean = false;
    private orderId: string | null = null;

    public createHubConnection = async (orderId: string): Promise<void> => {
        if (this.isConnecting) {
            await new Promise((resolve) => setTimeout(resolve, 100));
            return this.createHubConnection(orderId);
        }

        if (
            this.hubConnection?.state === signalR.HubConnectionState.Connected &&
            this.orderId === orderId
        ) return;

        if (
            this.hubConnection?.state === signalR.HubConnectionState.Connected &&
            this.orderId !== orderId
        ) {
            await this.stopConnection();
        }

        try {
            this.isConnecting = true;

            const orderHubUrl = import.meta.env.VITE_ORDER_URL;
            if (!orderHubUrl) throw new Error("VITE_ORDER_URL is not defined.");

            const connection = new signalR.HubConnectionBuilder()
                .withUrl(orderHubUrl, {
                    withCredentials: true,
                    transport: signalR.HttpTransportType.LongPolling,
                    // skipNegotiation: true,
                })
                .withAutomaticReconnect([0, 2000, 5000, 10000, 20000])
                .configureLogging(signalR.LogLevel.Warning)
                .build();

            connection.off("ReceiveOrderNotification");
            connection.on("ReceiveOrderNotification", (message: OrderNotification) => {
                this.notificationCallback?.(message);
            });

            let retries = 3;
            while (retries > 0) {
                try {
                    await connection.start();
                    this.hubConnection = connection;
                    this.orderId = orderId;
                    await this.hubConnection.invoke("JoinOrderGroup", orderId);
                    break;
                } catch (err) {
                    retries--;
                    if (retries === 0) throw err;
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                }
            }
        } finally {
            this.isConnecting = false;
        }
    };

    public stopConnection = async () => {
        try {
            if (this.hubConnection) {
                if (this.orderId && this.hubConnection.state === signalR.HubConnectionState.Connected) {
                    try {
                        await this.hubConnection.invoke("LeaveOrderGroup", this.orderId);
                    } catch { /* ignore */ }
                }
                await this.hubConnection.stop();
            }
        } catch (err) {
            console.error("Error stopping OrderSignalR connection:", err);
        } finally {
            this.orderId = null;
            this.notificationCallback = null;
            this.hubConnection = null;
        }
    };

    public onReceiveOrderNotification(callback: OrderNotificationCallback) {
        this.notificationCallback = callback;
    }
}

export const OrderSignalRService = new OrderSignalRServiceClass();
