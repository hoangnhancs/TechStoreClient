using System;
using Application.DTOs;
using Domain.Entities;

namespace Application.Mappers;

public static class OrderMapper
{
    public static OrderDto MapToDto(Order order)
    {

        return new OrderDto
        {
            Id = order.Id,
            UserId = order.UserId,
            ShippingAddressId = order.ShippingAddressId,
            BillingAddressId = order.BillingAddressId,
            SubToTal = order.SubToTal,
            ShippingCost = order.ShippingCost,
            Discount = order.Discount,
            PaymentMethod = order.PaymentMethod.ToString(),
            OrderStatus = order.OrderStatus.ToString(),
            Items = order.Items.Select(OrderItemMapper.MapToDto).ToList(),
            PaymentStatus = order.PaymentStatus.ToString(),
        };
    }
    public static OrderDto MapToDto(CreateOrUpdateOrderDto createOrUpdateOrderDto)
    {
        return new OrderDto
        {
            Id = string.Empty,
            UserId = createOrUpdateOrderDto.UserId,
            ShippingAddressId = createOrUpdateOrderDto.ShippingAddressId ?? string.Empty,
            BillingAddressId = createOrUpdateOrderDto.BillingAddressId ?? string.Empty,
            SubToTal = createOrUpdateOrderDto.SubToTal,
            ShippingCost = createOrUpdateOrderDto.ShippingCost,
            Discount = createOrUpdateOrderDto.Discount,
            PaymentMethod = createOrUpdateOrderDto.PaymentMethod?? string.Empty,
            OrderStatus = createOrUpdateOrderDto.OrderStatus,
            Items = createOrUpdateOrderDto.Items,
            PaymentStatus = createOrUpdateOrderDto?.PaymentStatus ?? string.Empty,
        };
    }
    public static Order MapToEntity(OrderDto orderDto)
    {
        return new Order
        {
            Id = orderDto.Id ?? string.Empty,
            UserId = orderDto.UserId ?? string.Empty,
            Items = orderDto.Items.Select(OrderItemMapper.MapToEntiy).ToList(),
            ShippingAddressId = orderDto.ShippingAddressId ?? string.Empty,
            BillingAddressId = orderDto.BillingAddressId,
            SubToTal = orderDto.SubToTal,
            ShippingCost = orderDto.ShippingCost,
            Total = orderDto.Items.Sum(x => x.UnitPrice * x.Quantity) + orderDto.ShippingCost - orderDto.Discount,
            Discount = orderDto.Discount,
            PaymentMethod = Enum.Parse<PaymentMethod>(orderDto.PaymentMethod),
            OrderStatus = Enum.Parse<OrderStatus>(orderDto.OrderStatus),
            PaymentStatus = Enum.Parse<PaymentStatus>(orderDto.PaymentStatus) ,
        };
    }
}
