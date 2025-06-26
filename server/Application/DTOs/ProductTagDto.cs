using System;

namespace Application.DTOs;

public class ProductTagDto
{
    public int Id { get; set; }
    public string Tag { get; set; } = string.Empty;
    public string ProductId { get; set; } = string.Empty;
}
