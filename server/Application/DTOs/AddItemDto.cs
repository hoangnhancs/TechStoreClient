using System;

namespace Application.DTOs;

public class AddItemDto
{
    public required ProductDto Product { get; set; }
    public int Quantity { get; set; } = 1;
}