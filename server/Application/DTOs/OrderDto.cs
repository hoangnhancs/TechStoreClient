using System;

namespace Application.DTOs;

public class OrderDto
{
    public string Id { get; set; } = null!;
    public required string UserId { get; set; }
    public required string BasketId { get; set; }
    public required string ShippingAddressId { get; set; }
    public string? BillingAddressId { get; set; }
    public long SubToTal { get; set; }
    public long ShippingCost { get; set; }
    public long Total { get; set; }
    public string PaymentMethod { get; set; } = null!;
}
