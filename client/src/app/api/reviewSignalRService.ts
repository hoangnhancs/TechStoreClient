import * as signalR from "@microsoft/signalr";
import { Review } from "../../lib/types";

type ReviewCallBack = (review: Review) => void;
type ReviewsCallBack = (reviews: Review[]) => void;

class ReviewSignalRServiceClass {
  private hubConnection: signalR.HubConnection | null = null;
  private reviewCallback: ReviewCallBack | null = null;
  private isConnecting: boolean = false;
  private activeProductId: string | null = null;

  public createHubConnection = async (
    productId: string,
    isAdmin: false
  ): Promise<void> => {
    if (this.isConnecting) {
      console.log("Connection reviews already in progress, waiting...");
      await new Promise((resolve) => setTimeout(resolve, 100));
      return this.createHubConnection(productId, isAdmin);
    }

    if (
      this.hubConnection &&
      this.hubConnection.state === signalR.HubConnectionState.Connected &&
      this.activeProductId == productId
    ) {
      // console.log(`Reviews hub already connected to product ${productId}`);
      return Promise.resolve();
    }

    if (
      this.hubConnection &&
      this.hubConnection.state === signalR.HubConnectionState.Connected &&
      this.activeProductId != productId
    ) {
      // console.log(
      //   `Reviews hub switching from product ${this.activeProductId} to product ${productId}`
      // );
      await this.hubConnection.stop();
    }

    try {
      this.isConnecting = true;
      const reviewHubUrl = import.meta.env.VITE_REVIEW_URL;
      if (!reviewHubUrl) {
        throw new Error(
          "VITE_REVIEW_URL is not defined in the environment variables."
        );
      }
      const newConnection = new signalR.HubConnectionBuilder()
        .withUrl(reviewHubUrl, {
          withCredentials: true,
          transport: signalR.HttpTransportType.WebSockets,
          skipNegotiation: true,
        })
        .withAutomaticReconnect([0, 2000, 5000, 10000, 20000])
        .build();

      newConnection.off("ReceiveReview");
      newConnection.on("ReceiveReview", (review: Review) => {
        if (this.reviewCallback) {
          this.reviewCallback(review);
        }
      });

      let retries = 3;
      while (retries > 0) {
        try {
          await newConnection.start();
          // console.log(
          //   "Reviews hub SignalR connected successfully after retries"
          // );
          this.activeProductId = productId;
          this.hubConnection = newConnection;

          if (productId) {
            await this.hubConnection.invoke("JoinProductGroup", productId);
          }
          if (isAdmin) {
            await this.hubConnection.invoke("JoinAdminGroup");
          }
          break; //connect ok thi break lai tranh re-connect khi da connected
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
  };

  public stopConnection = async () => {
    try {
      if (this.hubConnection) {
        if (
          this.activeProductId &&
          this.hubConnection.state === signalR.HubConnectionState.Connected
        ) {
          try {
            await this.hubConnection.invoke(
              "LeaveProductGroup",
              this.activeProductId
            );
          } catch (error) {
            console.error("Error while leaving product group: ", error);
          }
        }
        await this.hubConnection.stop();
        // console.log("SignalR connection stopped");
      }
    } catch (err) {
      console.error("Error while stopping connection: ", err);
    } finally {
      this.activeProductId = null;
      this.hubConnection = null;
      this.reviewCallback = null;
    }
  };

  public loadAllReviews = (productId: string, callback: ReviewsCallBack) => {
    if (
      !this.hubConnection ||
      this.hubConnection.state !== signalR.HubConnectionState.Connected
    ) {
      console.warn("Reviews hub Cannot load reviews: SignalR not connected");
      return;
    }
    this.hubConnection.off("ReceiveAllReviews");
    this.hubConnection.on("ReceiveAllReviews", (reviews: Review[]) => {
      callback(reviews);
    });
    this.hubConnection
      .invoke("LoadAllReviews", productId)
      .catch((err) => console.error("Error loading reviews: ", err));
  };

  public onReceiveNewReview = (callback: ReviewCallBack) => {
    this.reviewCallback = callback;
  };

  public sendReview = async (productId: string, comment: string, rating: number) => {
    if (
      !this.hubConnection ||
      this.hubConnection.state !== signalR.HubConnectionState.Connected
    ) {
      console.error("Reviews hub Cannot send review: SignalR not connected");
      return "";
    }
    try {
      const result = await this.hubConnection.invoke("SendReview",productId,comment,rating);
      return result as string;
    } catch (error) {
      console.error("Error while sending review: ", error);
      return "";
    }    
  };
}

export const ReviewSignalRService = new ReviewSignalRServiceClass();
