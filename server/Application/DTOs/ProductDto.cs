using System;

namespace Application.DTOs;

public class ProductDto
{
    public required string Id { get; set; } 
    public required string Name { get; set; }
    public string? Description { get; set; } = string.Empty;
    public required long Price { get; set; }
    public required string Category { get; set; } = string.Empty;
    public required string Brand { get; set; } = string.Empty;
    public required int QuantityInStock { get; set; }
    public required string ImageUrl { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
