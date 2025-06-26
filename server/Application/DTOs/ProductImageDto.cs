using System;

namespace Application.DTOs;

public class ProductImageDto
{
    public required string Id { get; set; } = string.Empty;
    public required string ImageUrl { get; set; }
    public required string ProductId { get; set; }
}
