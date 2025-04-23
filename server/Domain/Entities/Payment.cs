using System;

namespace Domain.Entities;

public class Payment
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public required string UserId { get; set; } 
    public User? User { get; set; }
    public required string OrderId { get; set; }
    public Order? Order { get; set; }
    public string? PaymentIntentId { get; set; }
    public string? ClientSecret { get; set; }
    public PaymentStatus Status { get; set; } = PaymentStatus.Pending;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public enum PaymentStatus
    {
        Pending,
        Processing,
        Succeeded,
        Failed,
        Canceled,
    }
}
