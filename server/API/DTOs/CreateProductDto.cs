using System;

namespace API.DTOs;

public class CreateProductDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public long OldPrice { get; set; }
    public long Discount { get; set; }
    public string CategoryId { get; set; } = string.Empty;
    public string BrandId { get; set; } = string.Empty;
    public int QuantityInStock { get; set; }
    public required IFormFile MainImageFile { get; set; }
    public List<IFormFile> DetailImageFiles { get; set; } = new List<IFormFile>();
    public Dictionary<int, string> FilterTags { get; set; } = new Dictionary<int, string>();
    public string AttributeGroupsJson { get; set; } = string.Empty;
    // public List<ProductAttributeGroupDto> AttributeGroups { get; set; } = [];
    //List<{GroupName: string, Attributes: List<{Key: string, Value: string}>}>
}
// public class ProductAttributeDto
// {
//     public string Key { get; set; } = null!;
//     public string Value { get; set; } = null!;
// }

// public class ProductAttributeGroupDto
// {
//     public string GroupName { get; set; } = null!;
//     public List<ProductAttributeDto> Attributes { get; set; } = new();
// }

