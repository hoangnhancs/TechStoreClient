using System;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace Application.DTOs;

public class ProductDto
{
    public string? Id { get; set; }
    public required string Name { get; set; }
    public List<string> Description { get; set; } = [];
    public required long OldPrice { get; set; }
    public required long Price { get; set; }
    public required long DiscountPercentage { get; set; }
    public required int CategoryId { get; set; }
    public CategoryDto? Category { get; set; }
    public string BrandId { get; set; } = string.Empty;
    public string BrandName { get; set; } = string.Empty;
    public required int QuantityInStock { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string? ImagePublicId { get; set; }
    public decimal AverageRating { get; set; } = 0;
    public int RatingCount { get; set; } = 0;
    public int UnitSold { get; set; } = 0;
    public string? UrlSlug { get; set; }
    public string? MetaTitle { get; set; }
    public string? MetaDescription { get; set; }
    public string? MetaKeywords { get; set; }
    public bool IsActive { get; set; } = true;
    public bool IsFeatured { get; set; } = false;
    public bool IsNewArrival { get; set; } = false;
    public bool IsOnSale { get; set; } = false;
    public List<ProductImageDto>? Images { get; set; } = [];
    public List<ProductTagFilterDto>? ProductTagFilters { get; set; } = [];
    public List<ProductTagDto>? Tags { get; set; } = [];
    public List<ProductAttributeDto>? Attributes { get; set; } = [];
    public List<ReviewDto>? Reviews { get; set; } = [];
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
