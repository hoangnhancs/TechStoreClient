using System.ComponentModel;

namespace Domain.Entities;

public class Product
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public required string Name { get; set; }
    public string? Description { get; set; } = string.Empty;
    public required long OldPrice { get; set; }
    public required long Price { get; set; }
    public required int DiscountPercentage { get; set; }
    public required int CategoryId { get; set; }
    public Category? Category { get; set; }
    public required string Brand { get; set; } = string.Empty;
    public required int QuantityInStock { get; set; }
    public string? UrlSlug { get; set; } 
    public string? MetaTitle { get; set; }
    public string? MetaDescription { get; set; }
    public string? MetaKeywords { get; set; }
    public bool IsActive { get; set; } = true;
    public bool IsFeatured { get; set; } = false;
    public bool IsNewArrival { get; set; } = false;
    public bool IsOnSale { get; set; } = false;
    public List<ProductTag>? Tags { get; set; } 
    public decimal AverageRating { get; set; } = 0;
    public int RatingCount { get; set; } = 0;
    public List<Review>? Reviews { get; set; }
    public List<ProductAttribute>? Attributes { get; set; }
    public int UnitsSold { get; set; } = 0;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}


