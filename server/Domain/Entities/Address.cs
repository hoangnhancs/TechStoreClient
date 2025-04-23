using System;

namespace Domain.Entities;

public class Address
{
    public string Id { get; set; } = Guid.NewGuid().ToString();    
    public required string UserId { get; set; } 
    public User? User { get; set; }
    public required string FullName { get; set; }
    public required string Line1 { get; set; }
    public string? Line2 { get; set; }
    public required string City { get; set; }
    public required string State { get; set; }
    public required string PostalCode { get; set; }
    public required string Country { get; set; }
    public string? PhoneNumber { get; set; }
    public AddressType Type { get; set; } 
    public bool IsDefault { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}

public enum AddressType
{
    Shipping = 1,
    Billing = 2,
    Both = 3
}
