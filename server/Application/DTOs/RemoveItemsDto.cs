using System;

namespace Application.DTOs;

public class RemoveItemsDto
{
    public required List<string> ProductIds { get; set; }
}
