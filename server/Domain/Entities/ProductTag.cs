using System;

namespace Domain.Entities;

public class ProductTag
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string ProductId { get; set; } = string.Empty;
    public Product? Product { get; set; } 
}
