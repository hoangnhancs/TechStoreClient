import * as signalR from '@microsoft/signalr';
import { Order, OrderNotification } from "../../lib/types";


type OrderCallBack = (order: Order) => void;
type OrderCreationMessageCallBack = (message: OrderNotification) => void;

class OrderSignalRServiceClass {
    private hubConnection: signalR.HubConnection | null = null;
    private orderCallBack: OrderCallBack | null = null;
    private orderCreationMessageCallBack: OrderCreationMessageCallBack | null = null;
    private isConnecting: boolean = false;
    private orderId: string | null = null;
    
    public createHubConnection = async (
        orderId: string
    ): Promise<void> => {
        console.log(`Attempting to connect to payment hub for order: ${orderId}`);
        // Nếu đang kết nối, đợi cho đến khi hoàn tất
        if (this.isConnecting) {
            // console.log("Connection already in progress, waiting...");
            await new Promise((resolve) => setTimeout(resolve, 100));
            return this.createHubConnection(orderId);
        }
    
        // Nếu đã kết nối với cùng sản phẩm, không cần kết nối lại
        if (
            this.hubConnection &&
            this.hubConnection.state === signalR.HubConnectionState.Connected &&
            this.orderId === orderId
        ) {
            // console.log(`Already connected to product ${orderId}`);
            return Promise.resolve();
        }
    
        // Nếu đã kết nối với sản phẩm khác, dừng kết nối cũ trước
        if (
            this.hubConnection &&
            this.hubConnection.state === signalR.HubConnectionState.Connected &&
            this.orderId !== orderId
        ) {
            // console.log(
            //   `Switching from product ${this.orderId} to ${orderId}`
            // );
            await this.stopConnection();
        }
    
        try {
            this.isConnecting = true;
        
            // Tạo kết nối mới
            const orderHubUrl = import.meta.env.VITE_ORDER_URL;
            console.log("Order hub URL from environment:", orderHubUrl);
            if (!orderHubUrl) {
                throw new Error(
                "VITE_ORDER_URL is not defined in the environment variables."
                );
            }

            const newConnection = new signalR.HubConnectionBuilder()
                .withUrl(orderHubUrl, {
                        withCredentials: true,
                        transport: signalR.HttpTransportType.WebSockets,
                        skipNegotiation: true,
                    })
                .withAutomaticReconnect([0, 2000, 5000, 10000, 20000])
                .configureLogging(signalR.LogLevel.Debug) // ← bật cái này
                .build();
        
            // Lưu connection vào biến tạm thời, không gán vào this.hubConnection ngay
            // Điều này để tránh race condition khi stop() được gọi trong quá trình kết nối
        
            newConnection.off("ReceiveOrderNotification");
                newConnection.on("ReceiveOrderNotification", (message: OrderNotification) => {
                    if (this.orderCreationMessageCallBack) {
                        // console.log("Received order creation failed message: ", message);
                        this.orderCreationMessageCallBack(message);
                    }
                })

            // Thử kết nối
            let retries = 3;
            while (retries > 0) {
                try {
                    // Start connection trên biến tạm thời
                    await newConnection.start();
                    // console.log("SignalR connected successfully after retries");

                    // CHỈ sau khi kết nối thành công mới gán vào this.hubConnection
                    this.hubConnection = newConnection;
                    this.orderId = orderId;

                    if (orderId) {
                        await this.hubConnection.invoke("JoinOrderGroup", orderId);
                    }

                    break;
                } catch (err) {
                    retries--;

                    if (retries === 0) {
                        console.error("Failed to connect after multiple attempts:", err);
                        throw err;
                    }

                    console.warn(`Connection attempt failed, retrying... (${retries} attempts left)`);
                    await new Promise((resolve) => setTimeout(resolve, 2000)); // Đợi trước khi thử lại
                }
            }
        } catch (err) {
            console.error("Error while starting connection: ", err);
            throw err;
        } finally {
            this.isConnecting = false;
            console.log(`Finished connection process for order: ${orderId}`);
        }
    };
    public stopConnection = async () => {
        try {
            if (this.hubConnection) {
                // Rời khỏi nhóm sản phẩm hiện tại nếu cần
                if (
                    this.orderId &&
                    this.hubConnection.state === signalR.HubConnectionState.Connected
                ) {
                    try {
                        await this.hubConnection.invoke(
                            "LeaveOrderGroup",
                            this.orderId
                        );
                    } catch {
                        // Bỏ qua lỗi khi rời nhóm, vì kết nối có thể đã mất
                    }
                }
        
                // Dừng kết nối
                await this.hubConnection.stop();
                // console.log("SignalR disconnected");
            }
        } catch (err) {
            console.error("Error stopping SignalR connection:", err);
        } finally {
            this.orderId = null;
            this.orderCallBack = null;
            this.hubConnection = null;
        }
    };

    public onReceiverErrorMessage(callback: OrderCreationMessageCallBack) {
        this.orderCreationMessageCallBack = callback;
    }
}

export const OrderSignalRService = new OrderSignalRServiceClass();