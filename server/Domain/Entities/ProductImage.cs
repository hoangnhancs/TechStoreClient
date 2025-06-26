using System;

namespace Domain.Entities;

public class ProductImage
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string ImageUrl { get; set; } = string.Empty;
    public string ProductId { get; set; } = string.Empty;
    public Product? Product { get; set; } 
}
