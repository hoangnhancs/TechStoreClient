using System;

namespace Domain.Entities;

public class ProductTagFilter
{
    public int Id { get; set; }
    public string ProductId { get; set; } = string.Empty;
    public Product? Product { get; set; }
    public int FilterTagValueId { get; set; }
    public FilterTagValue? FilterTagValue { get; set; }
}
