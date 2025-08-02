using System;

namespace Domain.Entities;

public class Review
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public required string ProductId { get; set; } = string.Empty;
    public Product? Product { get; set; } 
    public required string UserId { get; set; } = string.Empty;
    public User? User { get; set; } 
    public required int Rating { get; set; }
    public string? Comment { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
