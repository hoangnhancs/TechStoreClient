import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks";

import { Address, Basket, Item, PaymentInfor } from "../../lib/types";
import { setBasketStates } from "../../features/basket/basketSlice";
import { toast } from "react-toastify";
import { useCreateOrderMutation } from "../api/orderApi";
import {
  useCompletePaymentMutation,
  useCreatePaymentIntentMutation,
  useCreatePaymentMutation,
} from "../api/paymentApi";
import { useRemovePermanentlyBasketItemsMutation } from "../api/basketApi";
import { useState } from "react";

export const useOrderProcessing = () => {
  const shippingCost = 1000;
  const discount = 3000;

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { basket, selectedItems } = useAppSelector((state) => state.basket);
  const [createOrUpdateOrder] = useCreateOrderMutation();
  const [createOrUpdatePaymentIntent] = useCreatePaymentIntentMutation();
  const [completePayment] = useCompletePaymentMutation();
  const [createPayment] = useCreatePaymentMutation();
  const [removePermanentlyBasketItems] =
    useRemovePermanentlyBasketItemsMutation();

  const [currentStep, setCurrentStep] = useState(0);
  const [currentPaymentInfor, setCurrentPaymentInfor] = useState<PaymentInfor>({
    paymentMethod: "",
    walletType: null,
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
        quantity: item.quantity,
        unitPrice: item.price,
      })),
    shippingAddress: currentAddress?.detailAddress,
    billingAddress: currentAddress?.detailAddress,
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
      if (
        currentPaymentInfor.paymentMethod === "CreditCard" &&
        currentPaymentInfor.isValid
      ) {
        const stripe = currentPaymentInfor.stripe;
        const elements = currentPaymentInfor.elements;
        const cardElement = currentPaymentInfor.cardElement;

        if (!stripe || !elements || !cardElement) {
          toast.error("Stripe chưa được khởi tạo.");
          return;
        }

        const paymentData = await createOrUpdatePaymentIntent();

        if (!paymentData?.data?.clientSecret) {
          throw new Error("Client secret không khả dụng");
        }

        const { paymentIntent, error } = await stripe.confirmCardPayment(
          paymentData.data.clientSecret,
          {
            payment_method: {
              card: cardElement,
            },
          }
        );

        if (error) {
          toast.error(error.message);
          return;
        }

        if (paymentIntent?.status === "succeeded") {
          toast.success("Thanh toán thành công!");
          await completePayment();
          await createOrUpdateOrder({
            ...createOrderParas,
            shippingAddressId: currentAddress?.id,
            billingAddressId: currentAddress?.id,
            orderStatus: "Completed",
            paymentStatus: "Paid",
            paymentMethod: currentPaymentInfor.paymentMethod,
          });

          const productIds = selectedItems.map((item: Item) => item.productId);
          const newBasket = await removePermanentlyBasketItems({
            productIds: productIds,
          });
          dispatch(
            setBasketStates({
              selectedItems: [],
              basket:
                newBasket.data ?? ({ id: "", userId: "", items: [] } as Basket),
            })
          );
          navigate("/order-success");
        } else {
          toast.warning(
            `Trạng thái thanh toán: ${paymentIntent?.status || "unknown"}`
          );
        }
      } else {
        try {
          await createPayment();
          await completePayment();
          await createOrUpdateOrder({
            ...createOrderParas,
            shippingAddressId: currentAddress?.id,
            billingAddressId: currentAddress?.id,
            orderStatus: "Completed",
            paymentStatus: "Paid",
            paymentMethod:
              currentPaymentInfor.paymentMethod == "wallet"
                ? currentPaymentInfor.walletType
                : currentPaymentInfor.paymentMethod,
          });
          const productIds = selectedItems.map((item: Item) => item.productId);
          const newBasket = await removePermanentlyBasketItems({
            productIds: productIds,
          });
          dispatch(
            setBasketStates({
              selectedItems: [],
              basket:
                newBasket.data ?? ({ id: "", userId: "", items: [] } as Basket),
            })
          );
          navigate("/order-success");
        } catch (error) {
          toast.error("Không thể tạo đơn hàng. Vui lòng thử lại." + error);
        }
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
    if (
      currentPaymentInfor.paymentMethod === "wallet" &&
      !currentPaymentInfor.walletType
    )
      return false;
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
    handleCreateOrder,
    handleCreateOrderAndPayment,
    isCanCompleteOrder,
    completePayment,
  };
};
