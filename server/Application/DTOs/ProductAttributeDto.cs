using System;

namespace Application.DTOs;

public class ProductAttributeDto
{
    public required string Id { get; set; } = string.Empty;
    public required string Name { get; set; }
    public required string Value { get; set; }
    public required string ProductId { get; set; }
    public long DisplayOrder { get; set; }
    public string AttributeType { get; set; } = string.Empty;
}
