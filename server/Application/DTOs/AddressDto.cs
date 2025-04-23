using System;

namespace Application.DTOs;

public class AddressDto
{
    public string Id { get; set; } = null!;
    public string? UserId { get; set; }
    public string? FullName { get; set; }
    public string? Line1 { get; set; }
    public string? Line2 { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? PostalCode { get; set; }
    public string? Country { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Type { get; set; }
    public bool IsDefault { get; set; }
}
