using System;
using Application.DTOs;
using Domain.Entities;

namespace Application.Mappers;

public static class BasketItemMapper
{
    public static BasketItemDto MapToDto(BasketItem basketItem)
    {
        return new BasketItemDto
        {
            ProductId = basketItem.ProductId,
            ProductName = basketItem.Product?.Name ?? string.Empty,
            Quantity = basketItem.Quantity,
            ImageUrl = basketItem.Product?.ImageUrl ?? string.Empty,
            Price = basketItem.Product?.Price ?? 0,
            Brand = basketItem.Product?.Brand ?? string.Empty,
            Category = basketItem.Product?.Category ?? string.Empty,
        };
    }
}
