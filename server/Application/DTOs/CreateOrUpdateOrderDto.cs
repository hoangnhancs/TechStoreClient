using System;
using Application.DTOs;

namespace Application.DTOs;

public class CreateOrUpdateOrderDto
{
    public string? UserId { get; set; }
    public string? ShippingAddressId { get; set; }
    public string? BillingAddressId { get; set; }
    public long SubToTal { get; set; }
    public long ShippingCost { get; set; }
    public long Discount { get; set; }
    public List<OrderItemDto> Items { get; set; } = [];
    public string? PaymentMethod { get; set; }
    public string? PaymentStatus { get; set; }
    public string OrderStatus { get; set; } = null!;
}
