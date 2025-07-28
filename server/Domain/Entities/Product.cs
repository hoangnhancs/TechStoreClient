using System.ComponentModel;

namespace Domain.Entities;

public class Product
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public required string Name { get; set; }
    public List<string> Description { get; set; } = [];
    public required long OldPrice { get; set; }
    public required long Price { get; set; }
    public required long DiscountPercentage { get; set; }
    public required int CategoryId { get; set; }
    public Category? Category { get; set; }
    public required string Brand { get; set; }
    public required string MainImageUrl { get; set; }
    // chỉ dùng khi ảnh lưu trên Cloudinary
    public string? MainImagePublicId { get; set; }
    public required int QuantityInStock { get; set; }
    public string? UrlSlug { get; set; } 
    public string? MetaTitle { get; set; }
    public string? MetaDescription { get; set; }
    public string? MetaKeywords { get; set; }
    public bool IsActive { get; set; } = true;
    public bool IsFeatured { get; set; } = false;
    public bool IsNewArrival { get; set; } = false;
    public bool IsOnSale { get; set; } = false;
    public List<ProductTag> DisplayTags { get; set; } = [];
    public List<ProductTagFilter> ProductTagFilters { get; set; } = [];
    public decimal AverageRating { get; set; } = 0;
    public int RatingCount { get; set; } = 0;
    public List<Review> Reviews { get; set; } = [];
    public List<ProductImage> DetailImages { get; set; } = [];
    public List<ProductAttribute> Attributes { get; set; } = [];
    public int UnitSold { get; set; } = 0;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}


