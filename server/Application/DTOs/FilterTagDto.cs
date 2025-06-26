using System;

namespace Application.DTOs;

public class FilterTagDto
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public int CategoryId { get; set; }
    public List<FilterTagValueDto> Values { get; set; } = [];
}
