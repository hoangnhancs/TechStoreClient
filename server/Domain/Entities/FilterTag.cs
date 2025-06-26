using System;

namespace Domain.Entities;

public class FilterTag
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public int CategoryId { get; set; }
    public Category? Category { get; set; }
    public List<FilterTagValue> Values { get; set; } = [];
}
