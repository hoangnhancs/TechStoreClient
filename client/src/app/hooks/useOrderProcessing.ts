import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks";

import { Address, Basket, Item, Order, PaymentInfor } from "../../lib/types";
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

export const useOrderProcessing = () => {
  const shippingCost = 1000;
  const discount = 3000;
  const paymentIntentTimeoutMs = 30000;

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { basket, selectedItems } = useAppSelector((state) => state.basket);
  const [createOrder] = useCreateOrderMutation();
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

  const handleCreditCardOrderAndPayment = async () => {
    const stripe = currentPaymentInfor.stripe;
    const elements = currentPaymentInfor.elements;
    const cardElement = currentPaymentInfor.cardElement;

    if (!stripe || !elements || !cardElement) {
      toast.error("Stripe chưa được khởi tạo.");
      return;
    }

    const order = await createOrder(createOrderParas).unwrap();

    if (!order?.id) {
      throw new Error("Không thể tạo đơn hàng.");
    }

    const clientSecret = await getPaymentIntentFromPaymentHub(order.id);

    const { paymentIntent, error } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
        },
      }
    );

    console.log("PaymentIntent:", paymentIntent);
    console.log("Payment error:", error);

    if (error) {
      toast.error(error.message);
      return;
    }

    if (paymentIntent?.status !== "succeeded") {
      toast.warning(`Trạng thái thanh toán: ${paymentIntent?.status || "unknown"}`);
      return;
    }

    toast.success("Thanh toán thành công!");
    toast.success("Đặt hàng thành công!");
    // await completePayment().unwrap();
    await clearPurchasedItemsFromBasket();
    navigate(`/order-success/${order.id}`, {
      state: { orderNo: order.orderNo, orderId: order.id },
    });
  };

  const handleDefaultOrderAndPayment = async () => {
    const order = await createOrder(createOrderParas).unwrap();
    // await clearPurchasedItemsFromBasket();
    console.log("Order created:", order);
    toast.success("Đặt hàng thành công!");
    handleNavigateToOrderResult(order);
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

  // const handleCreateOrder = async () => {
  //   try {
  //     try {
  //       // await createOrUpdateOrder(createOrderParas).unwrap();
  //       navigate("/order");
  //     } catch (error) {
  //       console.error("Error creating order:", error);
  //       toast.error("Không thể tạo đơn hàng.");
  //     }
  //   } catch (error) {
  //     console.error("Error creating order:", error);
  //     toast.error("Không thể tạo đơn hàng. Vui lòng thử lại.");
  //   }
  // };

  const handleCreateOrderAndPayment = async () => {
    try {
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
    }
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

    // Constants
    shippingCost,
    discount,
    createOrderParas,

    // Methods
    getTotalPrice,
    handleActiveStepChange,
    handlePaymentInforChange,
    handleAddressChange,
    // handleCreateOrder,
    handleCreateOrderAndPayment,
    isCanCompleteOrder,
    completePayment,
  };
};
