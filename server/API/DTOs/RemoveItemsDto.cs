using System;

namespace API.DTOs;

public class RemoveItemsDto
{
    public required List<string> ProductIds { get; set; }
}
