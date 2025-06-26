using System;

namespace Application.DTOs;

public class BasketItemDto
{
    public required string ProductId { get; set; } 
    public string? ProductName { get; set; } 
    public string ImageUrl { get; set; } = null!;
    public int Quantity { get; set; }
    public long Price { get; set; }
    public required string Brand { get; set; }
    public required CategoryDto Category { get; set; }  
}
