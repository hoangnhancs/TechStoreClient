import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks";

import { Address, Basket, Item, Order, OrderNotification, /* OrderNotification ,*/ PaymentInfor } from "../../lib/types";
import { setBasketStates } from "../../features/basket/basketSlice";
import { toast } from "react-toastify";
import { useCreateOrderMutation } from "../api/orderApi";
import {
  useCompletePaymentMutation,
  // useCreatePaymentMutation,
} from "../api/paymentApi";
import { useRemovePermanentlyBasketItemsMutation } from "../api/basketApi";
import { useState } from "react";

import { PaymentSignalRService } from "../api/paymentSignalRService";
import { OrderSignalRService } from "../api/orderSignalRService";
import { uiUtil } from "../../lib/util/uiUtil";
// import { OrderSignalRService } from "../api/orderSignalRService";

export const useOrderProcessing = () => {
  const shippingCost = 1000;
  const discount = 3000;
  const paymentIntentTimeoutMs = 30000;
  // const orderNotificationTimeoutMs = 150000;

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { basket, selectedItems } = useAppSelector((state) => state.basket);
  const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation();
  const [completePayment] = useCompletePaymentMutation();
  // const [createPayment] = useCreatePaymentMutation();
  const [removePermanentlyBasketItems] =
    useRemovePermanentlyBasketItemsMutation();

  const [currentStep, setCurrentStep] = useState(0);
  const [currentPaymentInfor, setCurrentPaymentInfor] = useState<PaymentInfor>({
    paymentMethod: "",
    isValid: false,
  });
  const [currentAddress, setCurrentAddress] = useState<Address | null>(null);
  const [orderFailedDialogOpen, setOrderFailedDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Lỗi khi tạo đơn hàng. Vui lòng thử lại.");
  const [isProcessing, setIsProcessing] = useState(false);

  const getTotalPrice = () => {
    let total = 0;
    selectedItems.forEach((item: Item) => {
      total += item.price * item.quantity;
    });
    return total;
  };

  // Order parameters
  const createOrderParas = {
    items: (basket?.items || [])
      .filter((item: Item) =>
        selectedItems.find(
          (selectedItem: Item) => selectedItem.productId === item.productId
        )
      )
      .map((item: Item) => ({
        productId: item.productId,
        productName: item.productName,
        productImageUrl: item.imageUrl,
        quantity: item.quantity,
        unitPrice: item.price,
      })),
    recipientName: currentAddress?.fullName || "",
    recipientPhone: currentAddress?.phoneNumber || "",
    shippingAddress: currentAddress?.detailAddress + " " + currentAddress?.ward + " " + currentAddress?.district + " " + currentAddress?.province,
    billingAddress: currentAddress?.detailAddress + " " + currentAddress?.ward + " " + currentAddress?.district + " " + currentAddress?.province,
    shippingCost: shippingCost,
    discount: discount,
    paymentMethod: currentPaymentInfor.paymentMethod,
  };

  const handleActiveStepChange = (step: number) => {
    setCurrentStep(step);
  };

  const handlePaymentInforChange = (paymentInfor: PaymentInfor) => {
    setCurrentPaymentInfor(paymentInfor);
  };

  const handleAddressChange = (address: Address) => {
    setCurrentAddress(address);
  };

  const clearPurchasedItemsFromBasket = async () => {
    const productIds = selectedItems.map((item: Item) => item.productId);
    const newBasket = await removePermanentlyBasketItems({
      productIds,
    }).unwrap();

    dispatch(
      setBasketStates({
        selectedItems: [],
        basket: newBasket ?? ({ id: "", userId: "", items: [] } as Basket),
      })
    );
  };

  const getPaymentIntentFromPaymentHub = async (orderId: string) => {
    await PaymentSignalRService.createHubConnection(orderId);

    return new Promise<string>((resolve, reject) => {
      let isResolved = false;

      const resolveWithCleanup = (clientSecret: string) => {
        if (isResolved) return;
        isResolved = true;
        window.clearTimeout(timeoutId);
        void PaymentSignalRService.stopConnection();
        resolve(clientSecret);
      };

      const rejectWithCleanup = (error: Error) => {
        if (isResolved) return;
        isResolved = true;
        window.clearTimeout(timeoutId);
        void PaymentSignalRService.stopConnection();
        reject(error);
      };

      const timeoutId = window.setTimeout(() => {
        rejectWithCleanup(
          new Error("Quá thời gian chờ PaymentIntent từ payment hub.")
        );
      }, paymentIntentTimeoutMs);

      PaymentSignalRService.onReceivePayment((payment) => {
        if (!payment?.clientSecret) return;
        if (payment.orderId && payment.orderId !== orderId) return;

        resolveWithCleanup(payment.clientSecret);
      });

      // void createOrUpdatePaymentIntent()
      //   .unwrap()
      //   .catch((error) => {
      //     rejectWithCleanup(new Error(`Không thể tạo payment intent: ${error}`));
      //   });
    });
  };


  // const getOrderNotificationFromOrderHub = async (orderId: string) => {
  //   await OrderSignalRService.createHubConnection(orderId);

  //   return new Promise<OrderNotification>((resolve, reject) => {
  //     let isResolved = false;

  //     const resolveWithCleanup = (message: OrderNotification) => {
  //       if (isResolved) return;
  //       isResolved = true;
  //       window.clearTimeout(timeoutId);
  //       void OrderSignalRService.stopConnection();
  //       resolve(message);
  //     };

  //     const rejectWithCleanup = (error: Error) => {
  //       if (isResolved) return;
  //       isResolved = true;
  //       window.clearTimeout(timeoutId);
  //       void OrderSignalRService.stopConnection();
  //       reject(error);
  //     };

  //     const timeoutId = window.setTimeout(() => {
  //       rejectWithCleanup(
  //         new Error("Có lỗi không xác định. Vui lòng kiểm tra lại đơn hàng.")
  //       );
  //     }, orderNotificationTimeoutMs);

  //     OrderSignalRService.onReceiverErrorMessage((message) => {
  //       if (!message) return;
  //       resolveWithCleanup(message);
  //     });
  //   });
  // };

  const handleCreditCardOrderAndPayment = async () => {
    const stripe = currentPaymentInfor.stripe;
    const elements = currentPaymentInfor.elements;
    const cardElement = currentPaymentInfor.cardElement;

    if (!stripe || !elements || !cardElement) {
      toast.error("Stripe chưa được khởi tạo.");
      return;
    }

    try {
      // Step 1: Tạo order
      const order = await createOrder(createOrderParas).unwrap();
      if (!order.id) {
        toast.error("Lỗi khi tạo đơn hàng. Vui lòng thử lại.");
        return;
      }

      // Step 2: Join OrderHub ngay sau khi order được tạo
      // để không bỏ lỡ bất kỳ event nào từ saga (kể cả StockReservationFailed)
      await OrderSignalRService.createHubConnection(order.id);

      const orderNotificationPromise = new Promise<OrderNotification>((resolve) => {
        OrderSignalRService.onReceiveOrderNotification((notification) => {
          resolve(notification);
        });
      });

      // Step 3: Chờ clientSecret từ PaymentHub
      // Saga: StockReserved → CreatePayment → PaymentCreated → signal client
      let clientSecret: string;
      try {
        clientSecret = await getPaymentIntentFromPaymentHub(order.id);
      } catch {
        // Timeout hoặc payment creation fail — orderNotification cũng sẽ đến qua OrderHub
        // nhưng ta không cần đợi nó ở đây, show dialog luôn
        await OrderSignalRService.stopConnection();
        setOrderFailedDialogOpen(true);
        return;
      }

      // Step 4: Confirm thanh toán phía client (Stripe)
      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (error) {
        toast.error(error.message);
        await OrderSignalRService.stopConnection();
        return;
      }

      if (paymentIntent?.status !== "succeeded") {
        toast.warning(`Trạng thái thanh toán: ${paymentIntent?.status ?? "unknown"}`);
        await OrderSignalRService.stopConnection();
        return;
      }

      // Step 5: Chờ OrderNotification
      const timeoutPromise = new Promise<null>((resolve) =>   // resolve null, không reject
        window.setTimeout(() => resolve(null), 30000)
      );

      const result = await Promise.race([orderNotificationPromise, timeoutPromise]);
      await OrderSignalRService.stopConnection();

      if (result === null) {
        // Timeout — webhook chưa đến, KHÔNG phải fail
        await clearPurchasedItemsFromBasket();
        // Reconciliation job sẽ xử lý sau
        navigate(`/order-pending/${order.id}`, {
          state: { orderNo: order.orderNo, message: "Thanh toán đang được xác nhận. Vui lòng kiểm tra lại đơn hàng sau ít phút." }
        });
        return;
      }

      if (!result.isSuccess) {
        // Saga xác nhận fail thật sự
        setErrorMessage(result.errorMessage || "Đặt hàng thất bại.");
        setOrderFailedDialogOpen(true);
        return;
      }

      // Step 6: Success
      await clearPurchasedItemsFromBasket();
      toast.success("Đặt hàng thành công!");
      navigate(`/order-success/${order.id}`, {
        state: { orderNo: order.orderNo, orderId: order.id },
      });

    } catch (error) {
      toast.error(`Lỗi khi xử lý đơn hàng: ${error instanceof Error ? error.message : "Vui lòng thử lại."}`);
    }
  };


  const handleDefaultOrderAndPayment = async () => {
    try {
      const order = await createOrder(createOrderParas).unwrap();
      if (!order.id) {
        toast.error("Lỗi khi tạo đơn hàng. Vui lòng thử lại.");
        return;
      }

      await OrderSignalRService.createHubConnection(order.id);

      // Resolve trên cả success lẫn failure
      const orderNotificationPromise = new Promise<OrderNotification>((resolve) => {
        OrderSignalRService.onReceiveOrderNotification(resolve);
      });

      // Timeout fallback nếu saga/signalr có vấn đề
      const timeoutPromise = new Promise<null>((resolve) =>
        window.setTimeout(() => resolve(null), 15000)
      );

      const result = await Promise.race([orderNotificationPromise, timeoutPromise]);
      await OrderSignalRService.stopConnection();

      if (result === null) {
        // Timeout — saga chưa phản hồi, navigate pending an toàn
        await clearPurchasedItemsFromBasket();
        navigate(`/order-pending/${order.id}`, {
          state: { orderNo: order.orderNo }
        });
        return;
      }

      if (!result.isSuccess) {
        setErrorMessage(result.errorMessage || "Đặt hàng thất bại.");
        setOrderFailedDialogOpen(true);
        return;
      }

      // IsSuccess=true → StockReserved, order đang WaitingForConfirmation
      await clearPurchasedItemsFromBasket();
      toast.success("Đặt hàng thành công!");
      handleNavigateToOrderResult(order);
    } catch (error) {
      toast.error(`Lỗi khi tạo đơn hàng: ${error instanceof Error ? error.message : "Vui lòng thử lại."}`);
    }
  };



  const handleNavigateToOrderResult = (order: Order) => {
    if (order.status == "Processing")
      navigate(`/order-success/${order.id}`, {
        state: { orderNo: order.orderNo, orderId: order.id },
      });
    else
      navigate(`/order-success/${order.id}`, {
        state: { orderNo: order.orderNo, orderId: order.id },
      });
  }

  const handleCreateOrder = async () => {
    try {
      try {
        // await createOrUpdateOrder(createOrderParas).unwrap();
        navigate("/order");
      } catch (error) {
        console.error("Error creating order:", error);
        toast.error("Không thể tạo đơn hàng.");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Không thể tạo đơn hàng. Vui lòng thử lại.");
    }
  };

  const handleCreateOrderAndPayment = async () => {
    try {
      setIsProcessing(true);
      uiUtil.startLoading();
      if (
        currentPaymentInfor.paymentMethod === "CreditCard" &&
        currentPaymentInfor.isValid
      ) {
        await handleCreditCardOrderAndPayment();
      } else {
        await handleDefaultOrderAndPayment();
      }
    } catch (error: unknown) {
      console.error("Error creating order:", error);

      if (error instanceof Error) {
        toast.error(`Không thể tạo đơn hàng: ${error.message}`);
      } else {
        toast.error("Không thể tạo đơn hàng. Vui lòng thử lại.");
      }
    } finally {
      uiUtil.stopLoading();
      setIsProcessing(false);
    }
  };

  const handleOrderFailedDialogClose = () => {
    setErrorMessage("Lỗi khi tạo đơn hàng. Vui lòng thử lại.");
    setOrderFailedDialogOpen(false);
  };

  const isCanCompleteOrder = () => {
    if (
      currentPaymentInfor.paymentMethod === "CreditCard" &&
      !currentPaymentInfor.isValid
    )
      return false;
    // if (
    //   currentPaymentInfor.paymentMethod === "wallet" &&
    //   !currentPaymentInfor.walletType
    // )
    //   return false;
    if (currentStep !== 2) return false;
    if (currentAddress === null) return false;
    return true;
  };

  

  return {
    // State
    currentPaymentInfor,
    currentAddress,
    currentStep,
    selectedItems,
    basket,
    orderFailedDialogOpen,
    isCreatingOrder: isProcessing || isCreatingOrder,

    // Constants
    shippingCost,
    discount,
    createOrderParas,

    // Methods
    getTotalPrice,
    handleActiveStepChange,
    handlePaymentInforChange,
    handleAddressChange,
    handleCreateOrder,
    handleCreateOrderAndPayment,
    handleOrderFailedDialogClose,
    isCanCompleteOrder,
    completePayment,
    errorMessage,
  };
};
