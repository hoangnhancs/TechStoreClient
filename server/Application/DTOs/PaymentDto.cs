using System;

namespace Application.DTOs;

public class PaymentDto
{
    public string Id { get; set; } = null!;
    public string OrderId { get; set; } = null!;
    public string? PaymentIntentId { get; set; }
    public string? ClientSecret { get; set; }
    public string Status { get; set; } = null!;
}
