using System;

namespace Application.DTOs;

public class ProductTagFilterDto
{
    public int Id { get; set; }
    public int FilterTagId { get; set; }
    public required int FilterTagValueId { get; set; }
    public string ProductId { get; set; } = string.Empty;
}
