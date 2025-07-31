using System;
using Microsoft.AspNetCore.Identity;

namespace Domain.Entities;

public class User : IdentityUser
{
    public string? DisplayName { get; set; }
    public UserImage? Image { get; set; }
    public Basket? Basket { get; set; }
    public long TotalSpent { get; set; }
    public bool IsAdmin { get; set; } = false;
    public UserGender Gender { get; set; } = UserGender.None;
    public DateOnly? DateOfBirth { get; set; }
    public List<Address> Addresses { get; set; } = [];
    public List<Order> Ordereds { get; set; } = [];
    public List<Payment> Payments { get; set; } = [];
    public List<RefreshToken> RefreshTokens { get; set; } = [];
    // public List<Notification> NotificationGroups { get; set; } = [];
    public enum UserGender
    {
        None,
        Male,
        Female,
        Other,
    }
}

