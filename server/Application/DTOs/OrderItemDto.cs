using System;
using Domain.Entities;

namespace Application.DTOs;

public class OrderItemDto
{
    public required string ProductId { get; set; } 
    public string? ProductName { get; set; } 
    public string ImageUrl { get; set; } = null!;
    public int Quantity { get; set; }
    public long UnitPrice { get; set; }
    public required string Brand { get; set; }
    public required CategoryDto Category { get; set; }
    public string? OrderId { get; set; } 
}
