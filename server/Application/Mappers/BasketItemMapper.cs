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
            Id = basketItem.Id,
            ProductId = basketItem.ProductId,
            ProductName = basketItem.Product.Name,
            Quantity = basketItem.Quantity,
            ImageUrl = basketItem.Product.ImageUrl,
            Price = basketItem.Product.Price,
            Brand = basketItem.Product.Brand,
            Category = basketItem.Product.Category,
        };
    }
}
