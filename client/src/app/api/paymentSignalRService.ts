import * as signalR from "@microsoft/signalr";
import { Payment } from "../../lib/types";

type PaymentCallBack = (payment: Payment) => void;

class PaymentSignalRServiceClass {
    private hubConnection: signalR.HubConnection | null = null;
    private paymentCallBack: PaymentCallBack | null = null;
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
            const paymentHubUrl = import.meta.env.VITE_PAYMENT_URL;
            console.log("Payment hub URL from environment:", paymentHubUrl);
            if (!paymentHubUrl) {
                throw new Error(
                "VITE_PAYMENT_URL is not defined in the environment variables."
                );
            }

            const newConnection = new signalR.HubConnectionBuilder()
                .withUrl(paymentHubUrl, {
                        withCredentials: true,
                        transport: signalR.HttpTransportType.LongPolling,
                        // skipNegotiation: true,
                    })
                .withAutomaticReconnect([0, 2000, 5000, 10000, 20000])
                .configureLogging(signalR.LogLevel.Debug) // ← bật cái này
                .build();
        
            // Lưu connection vào biến tạm thời, không gán vào this.hubConnection ngay
            // Điều này để tránh race condition khi stop() được gọi trong quá trình kết nối
        
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
                        await this.hubConnection.invoke("JoinPaymentGroup", orderId);
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
                        "LeavePaymentGroup",
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
            this.paymentCallBack = null;
            this.hubConnection = null;
        }
    };

    public onReceivePayment(callback: PaymentCallBack) {
        this.paymentCallBack = callback;
        if (this.hubConnection) {
            this.hubConnection.off("ReceivePayment"); // Đảm bảo không đăng ký trùng lặp
            this.hubConnection.on("ReceivePayment", (payment: Payment) => {
                if (this.paymentCallBack) {
                    this.paymentCallBack(payment);
                }
            });
        }
    }
    
}

export const PaymentSignalRService = new PaymentSignalRServiceClass();