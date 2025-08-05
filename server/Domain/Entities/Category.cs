using System;

namespace Domain.Entities;

public class Category
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string DisplayName { get; set; }
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public List<Product> Products { get; set; } = [];
    public List<FilterTag> FilterTags { get; set; } = [];
}
