using System;

namespace Application.DTOs;

public class BasketDto
{
    public string Id { get; set; } = null!;
    public required string UserId { get; set; }
    public List<BasketItemDto> Items { get; set; } = [];
    public PaymentDto? Payment { get; set; }
}
