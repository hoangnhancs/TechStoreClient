using System;

namespace Application.DTOs;

public class OrderDto
{
    public string Id { get; set; } = null!;
    public string? UserId { get; set; }
    public UserDto? User { get; set; }
    public string? ShippingAddressId { get; set; }
    public string? BillingAddressId { get; set; }
    public long SubToTal { get; set; }
    public long ShippingCost { get; set; }
    public long Discount { get; set; }
    public List<OrderItemDto> Items { get; set; } = [];
    public string PaymentMethod { get; set; } = null!;
    public string PaymentStatus { get; set; } = null!;
    public string OrderStatus { get; set; } = null!;
    public DateTime? UpdatedAt { get; set; }
}
