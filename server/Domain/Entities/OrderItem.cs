using System;

namespace Domain.Entities;

public class OrderItem
{
    public int Id { get; set; }
    public int Quantity { get; set; }
    public long UnitPrice { get; set; }
    public required string ProductId { get; set; }
    public Product? Product { get; set; }
    public required string OrderId { get; set; }
    public Order Order { get; set; } = null!;
}
