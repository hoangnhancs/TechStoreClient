using System;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace Application.DTOs;

public class ProductDto
{
    public required string Id { get; set; }
    public required string Name { get; set; }
    public List<string> Description { get; set; } = [];
    public required long OldPrice { get; set; }
    public required long Price { get; set; }
    public required long DiscountPercentage { get; set; }
    public required int CategoryId { get; set; }
    public required CategoryDto Category { get; set; }
    public required string Brand { get; set; } = string.Empty;
    public required int QuantityInStock { get; set; }
    public required string ImageUrl { get; set; } = string.Empty;
    public required decimal AverageRating { get; set; } 
    public required int RatingCount { get; set; }
    public required int UnitSold { get; set; }
    public string? UrlSlug { get; set; }
    public string? MetaTitle { get; set; }
    public string? MetaDescription { get; set; }
    public string? MetaKeywords { get; set; }
    public bool IsActive { get; set; } = true;
    public bool IsFeatured { get; set; } = false;
    public bool IsNewArrival { get; set; } = false;
    public bool IsOnSale { get; set; } = false;
    public required List<ProductImageDto> Images { get; set; } = [];
    public required List<ProductTagFilterDto> ProductTagFilters { get; set; } = [];
    public required List<ProductTagDto> Tags { get; set; } = [];
    public required List<ProductAttributeDto> Attributes { get; set; } = [];
    public required List<ReviewDto> Reviews { get; set; } = [];
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
