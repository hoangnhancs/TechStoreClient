using System;

namespace Application.DTOs;

public class FlashSaleProductDto
{
    public int Id { get; set; }
    public required string ProductId { get; set; } 
    public string? ProductName { get; set; }
    public long OldPrice { get; set; }
    public long FlashPrice { get; set; }
    public int TotalQuantity { get; set; }
    public int RemainQuntity { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
}
