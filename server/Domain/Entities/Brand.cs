using System;

namespace Domain.Entities;

public class Brand
{
    public int Id { get; set; }
    public int CategoryId { get; set; }
    public Category? Category { get; set; }
    public required string Name { get; set; }
    public required string ImageUrl { get; set; }
}
