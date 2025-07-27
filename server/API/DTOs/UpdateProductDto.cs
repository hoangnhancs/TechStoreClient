using System;

namespace API.DTOs;

public class UpdateProductDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public long OldPrice { get; set; }
    public long Discount { get; set; }
    public string CategoryId { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public int QuantityInStock { get; set; }
    public IFormFile? MainImageFile { get; set; }
    public string? MainImageUrl { get; set; }

    public List<IFormFile> DetailImageFiles { get; set; } = [];
    public List<string> DetailImageUrls { get; set; } = [];
    public Dictionary<int, string> FilterTags { get; set; } = new Dictionary<int, string>();
    public string AttributeGroupsJson { get; set; } = string.Empty;
}
