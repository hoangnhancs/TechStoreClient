using System;
using Application.DTOs;
using Domain.Entities;

namespace Application.Mappers;

public static class BasketMapper
{
    public static BasketDto MapToDto(Basket basket)
    {
        return new BasketDto
        {
            Id = basket.Id,
            UserId = basket.UserId,
            Items = basket.Items.Select(BasketItemMapper.MapToDto).ToList(),
        };
    }
}
