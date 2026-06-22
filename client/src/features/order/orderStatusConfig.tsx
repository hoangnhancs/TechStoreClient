import {
  AccessTime,
  Cancel,
  CheckCircle,
  HourglassTop,
  Inventory2,
  LocalShipping,
  Payments,
} from "@mui/icons-material";
import type { ChipProps } from "@mui/material";
import type { ReactElement } from "react";

export type OrderStatus =
  | "Pending"
  | "WaitingForConfirmation"
  | "WaitingForPayment"
  | "Processing"
  | "HandedOverToCarrier"
  | "Delivered"
  | "Completed"
  | "Cancelled";

type OrderStatusConfig = {
  label: string;
  color: ChipProps["color"];
  icon: ReactElement;
};

export const orderStatusConfig: Record<OrderStatus, OrderStatusConfig> = {
  Pending: {
    label: "Chờ xử lý",
    color: "warning",
    icon: <HourglassTop />,
  },
  WaitingForConfirmation: {
    label: "Chờ xác nhận",
    color: "warning",
    icon: <AccessTime />,
  },
  WaitingForPayment: {
    label: "Chờ thanh toán",
    color: "info",
    icon: <Payments />,
  },
  Processing: {
    label: "Đang xử lý",
    color: "primary",
    icon: <Inventory2 />,
  },
  HandedOverToCarrier: {
    label: "Đã giao vận chuyển",
    color: "secondary",
    icon: <LocalShipping />,
  },
  Delivered: {
    label: "Đã giao hàng",
    color: "success",
    icon: <LocalShipping />,
  },
  Completed: {
    label: "Hoàn tất",
    color: "success",
    icon: <CheckCircle />,
  },
  Cancelled: {
    label: "Đã hủy",
    color: "error",
    icon: <Cancel />,
  },
};

export function getOrderStatusConfig(status: string): OrderStatusConfig {
  return (
    orderStatusConfig[status as OrderStatus] ?? {
      label: status,
      color: "default",
      icon: <AccessTime />,
    }
  );
}