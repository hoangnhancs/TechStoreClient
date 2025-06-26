using System;
using Application.DTOs;

namespace API.DTOs;

public class AddItemDto
{
    public required ProductDto Product { get; set; }
    public int Quantity { get; set; } = 1;
}