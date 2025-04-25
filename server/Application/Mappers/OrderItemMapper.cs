using System;
using Application.DTOs;
using Domain.Entities;

namespace Application.Mappers;

public class OrderItemMapper
{
    public static OrderItemDto MapToDto(OrderItem orderItem)
    {
        return new OrderItemDto
        {
            ProductId = orderItem.ProductId,
            ProductName = orderItem.Product?.Name,
            Quantity = orderItem.Quantity,
            ImageUrl = orderItem.Product?.ImageUrl ?? string.Empty,
            UnitPrice = orderItem.UnitPrice,
            Brand = orderItem.Product?.Brand ?? string.Empty,
            Category = orderItem.Product?.Category ?? string.Empty,
        };
    }
    public static OrderItem MapToEntiy(OrderItemDto orderItemDto)
    {
        return new OrderItem
        {
            ProductId = orderItemDto.ProductId,
            Quantity = orderItemDto.Quantity,
            UnitPrice = orderItemDto.UnitPrice,
            OrderId = orderItemDto.OrderId ?? string.Empty,
        };
    }
}
