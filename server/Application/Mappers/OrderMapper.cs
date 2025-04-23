using System;
using Application.DTOs;
using Domain.Entities;

namespace Application.Mappers;

public class OrderMapper
{
    public static OrderDto MapToDto(Order order)
    {
        return new OrderDto
        {
            Id = order.Id,
            UserId = order.UserId,
            BasketId = order.BasketId,
            ShippingAddressId = order.ShippingAddressId,
            BillingAddressId = order.BillingAddressId,
            SubToTal = order.SubToTal,
            ShippingCost = order.ShippingCost,
            Total = order.Total,
            PaymentMethod = order.PaymentMethod.ToString(),
            CreatedAt = order.CreatedAt,
            UpdatedAt = order.UpdatedAt,
        };
    }
}
