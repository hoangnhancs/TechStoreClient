using System;

namespace Domain.Entities;

public class ProductImage
{
    public required string Id { get; set; } = Guid.NewGuid().ToString();
    public required string ImageUrl { get; set; } 
    public bool IsMain { get; set; } = false;
    public required string ProductId { get; set; }
    public Product? Product { get; set; } 
}
