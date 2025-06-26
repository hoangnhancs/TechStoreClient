import * as signalR from "@microsoft/signalr";
import { Comment } from "../../lib/types";

type CommentCallback = (comment: Comment) => void;
type CommentsCallback = (comments: Comment[]) => void;

class CommentSignalRServiceClass {
  private hubConnection: signalR.HubConnection | null = null;
  private commentCallback: CommentCallback | null = null;
  private isConnecting: boolean = false;
  private activeProductId: string | null = null;

  public createHubConnection = async (
    productId: string,
    isAdmin = false
  ): Promise<void> => {
    // Nếu đang kết nối, đợi cho đến khi hoàn tất
    if (this.isConnecting) {
      console.log("Connection already in progress, waiting...");
      await new Promise((resolve) => setTimeout(resolve, 100));
      return this.createHubConnection(productId, isAdmin);
    }

    // Nếu đã kết nối với cùng sản phẩm, không cần kết nối lại
    if (
      this.hubConnection &&
      this.hubConnection.state === signalR.HubConnectionState.Connected &&
      this.activeProductId === productId
    ) {
      console.log(`Already connected to product ${productId}`);
      return Promise.resolve();
    }

    // Nếu đã kết nối với sản phẩm khác, dừng kết nối cũ trước
    if (
      this.hubConnection &&
      this.hubConnection.state === signalR.HubConnectionState.Connected &&
      this.activeProductId !== productId
    ) {
      console.log(
        `Switching from product ${this.activeProductId} to ${productId}`
      );
      await this.stopConnection();
    }

    try {
      this.isConnecting = true;

      // Tạo kết nối mới
      const newConnection = new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:5001/commentHub", {
          withCredentials: true,
          transport: signalR.HttpTransportType.WebSockets,
          skipNegotiation: true,
        })
        .withAutomaticReconnect([0, 2000, 5000, 10000, 20000])
        .configureLogging(signalR.LogLevel.Debug)
        .build();

      // Lưu connection vào biến tạm thời, không gán vào this.hubConnection ngay
      // Điều này để tránh race condition khi stop() được gọi trong quá trình kết nối

      // Đăng ký listener
      newConnection.off("ReceiveComment");
      newConnection.on("ReceiveComment", (comment) => {
        if (this.commentCallback) {
          this.commentCallback(comment);
        }
      });

      // Thử kết nối
      let retries = 3;
      while (retries > 0) {
        try {
          // Start connection trên biến tạm thời
          await newConnection.start();
          console.log("SignalR connected successfully after retries");

          // CHỈ sau khi kết nối thành công mới gán vào this.hubConnection
          this.hubConnection = newConnection;
          this.activeProductId = productId;

          if (productId) {
            await this.hubConnection.invoke("JoinProductGroup", productId);
          }
          if (isAdmin) {
            await this.hubConnection.invoke("JoinAdminGroup");
          }

          break;
        } catch (err) {
          retries--;

          if (retries === 0) {
            console.error("Failed to connect after multiple attempts:", err);
            throw err;
          }

          console.warn(
            `Connection attempt failed, retrying... (${retries} attempts left)`
          );
          await new Promise((resolve) => setTimeout(resolve, 2000)); // Đợi trước khi thử lại
        }
      }
    } catch (err) {
      console.error("Error while starting connection: ", err);
      throw err;
    } finally {
      this.isConnecting = false;
    }
  };

  public stopConnection = async () => {
    try {
      if (this.hubConnection) {
        // Rời khỏi nhóm sản phẩm hiện tại nếu cần
        if (
          this.activeProductId &&
          this.hubConnection.state === signalR.HubConnectionState.Connected
        ) {
          try {
            await this.hubConnection.invoke(
              "LeaveProductGroup",
              this.activeProductId
            );
          } catch {
            // Bỏ qua lỗi khi rời nhóm, vì kết nối có thể đã mất
          }
        }

        // Dừng kết nối
        await this.hubConnection.stop();
        console.log("SignalR disconnected");
      }
    } catch (err) {
      console.error("Error stopping SignalR connection:", err);
    } finally {
      this.activeProductId = null;
      this.commentCallback = null;
      this.hubConnection = null;
    }
  };

  public loadAllComments = (productId: string, callback: CommentsCallback) => {
    if (
      !this.hubConnection ||
      this.hubConnection.state !== signalR.HubConnectionState.Connected
    ) {
      console.warn("Cannot load comments: SignalR not connected");
      return;
    }

    // Đăng ký callback để nhận danh sách comments
    this.hubConnection.off("ReceiveAllComments"); // Xóa handler cũ nếu có
    this.hubConnection.on("ReceiveAllComments", (comments: Comment[]) => {
      callback(comments);
    });

    // Gọi method trên server
    this.hubConnection
      .invoke("LoadAllComments", productId)
      .catch((err) => console.error("Error loading comments:", err));
  };

  public onReceiveNewComment = (callback: CommentCallback) => {
    this.commentCallback = callback;
  };

  public sendComment = (
    productId: string,
    content: string,
    parentCommentId?: string
  ) => {
    if (
      !this.hubConnection ||
      this.hubConnection.state !== signalR.HubConnectionState.Connected
    ) {
      console.error("Cannot send comment: SignalR not connected");
      return;
    }

    this.hubConnection
      .invoke("SendComment", productId, content, parentCommentId || null)
      .catch((err) => console.error("Error sending comment:", err));
  };
}

// Tạo và export một instance duy nhất
export const CommentSignalRService = new CommentSignalRServiceClass();
