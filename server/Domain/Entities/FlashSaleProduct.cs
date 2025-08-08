using System;

namespace Domain.Entities;

public class FlashSaleProduct
{
    public int Id { get; set; }
    public required string ProductId { get; set; }  
    public Product? Product { get; set; }
    public long FlashPrice { get; set; }
    public int TotalQuantity { get; set; }
    public int RemainQuntity { get; set; }
    public bool IsDeleted { get; set; }
    public bool IsExpired => EndTime <= DateTime.Now;
    public bool IsInProgress =>
    IsDeleted && !IsExpired && RemainQuntity > 0 && DateTime.Now >= StartTime;
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
}
