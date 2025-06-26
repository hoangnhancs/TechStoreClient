using System;

namespace Application.DTOs;

public class FilterTagValueDto
{
    public int Id { get; set; }
    public string Value { get; set; } = "";
    public int FilterTagId { get; set; }
}
