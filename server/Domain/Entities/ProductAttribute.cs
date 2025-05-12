using System;

namespace Domain.Entities;

public class ProductAttribute
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Name { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public string ProductId { get; set; } = string.Empty;
    public Product? Product { get; set; }
    public int DisplayOrder { get; set; } 
    public string AttributeType { get; set; } = string.Empty; // "text", "number", "color", "size", etc.
}

public enum AttributeType
{
    ProcessorAndGraphics,
    MemoryAndStorage,
    Dispay,
    Audio,
    
}
