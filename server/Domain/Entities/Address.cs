using System;

namespace Domain.Entities;

public class Address
{
    public string Id { get; set; } = Guid.NewGuid().ToString();    
    public required string UserId { get; set; } 
    public User? User { get; set; }
    public required string FullName { get; set; }
    public required string Province { get; set; }
    public string? District { get; set; }
    public required string Ward { get; set; }
    public required string DetailAddress { get; set; }
    public string? PhoneNumber { get; set; }
    public AddressType Type { get; set; } 
    public bool IsDefault { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}

public enum AddressType
{
    Shipping,
    Billing,
    Both,
}
