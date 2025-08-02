using System;

namespace Application.DTOs;

public class BrandDto
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public int CategoryId { get; set; }
    public string? ImageUrl { get; set; }
}
