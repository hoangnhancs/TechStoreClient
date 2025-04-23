using System;

namespace Domain.Entities;

public class Order
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public required string UserId { get; set; }
    public User? User { get; set; } 
    public required string BasketId { get; set; }
    public Basket? Basket { get; set; }
    public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Paid;
    public OrderStatus OrderStatus { get; set; } = OrderStatus.Created;
    public required string ShippingAddressId { get; set; }
    public Address? ShippingAddress { get; set; }
    public string? BillingAddressId { get; set; }
    public Address? BillingAddress { get; set; }
    public long SubToTal {get; set; }
    public long ShippingCost { get; set; } 
    public long Total { get; set; }
    public PaymentMethod PaymentMethod { get; set; } = PaymentMethod.CashOnDelivery;
    public required string PaymentId { get; set; } 
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}

public enum PaymentStatus
{
    Pending = 1,         
    Paid = 2,   
}         
public enum OrderStatus
{
    Created = 1,      
    Processing = 2,       
    Shipped = 3,         
    Delivered = 4,      
    Completed = 5,      
    Cancelled = 6   
}
public enum PaymentMethod
{
    CashOnDelivery = 1, 
    CreditCard = 2,    
    VNpay = 3,       
    Momo = 4,       
    BankTransfer = 5,  
}

