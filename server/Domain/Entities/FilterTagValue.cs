using System;

namespace Domain.Entities;

public class FilterTagValue
{
    public int Id { get; set; }
    public string Value { get; set; } = "";
    public int FilterTagId { get; set; }
    public FilterTag? FilterTag { get; set; }
}
