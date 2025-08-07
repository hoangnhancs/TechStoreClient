using System;

namespace Domain.Entities;

public class UserActionTracking
{
    public int Id { get; set; }
    public required string UserId { get; set; }
    public User? User { get; set; }
    public required string ProductId { get; set; }
    public Product? Product { get; set; }
    public UserActionType ActionType { get; set; }
    public DateTime ActionTime { get; set; } = DateTime.UtcNow;
    public string? MetaData { get; set; }
    public enum UserActionType
    {
        View,
        AddToCart,
        Purchase
    }
}
