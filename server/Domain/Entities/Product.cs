namespace Domain.Entities;

public class Product
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
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


